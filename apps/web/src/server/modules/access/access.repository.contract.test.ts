import { randomUUID } from "node:crypto";
import { user } from "@cairn/db/schema/auth";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createDisposableDatabase } from "../../../../tests/support/disposableDatabase.js";
import { companyTable } from "../company/company.server.js";
import { Access } from "../../../pages/access/access.js";
import type { AccessRepository } from "../../../pages/access/access.js";
import { DrizzleAccessRepository } from "./access.repository.server.js";
import { InMemoryAccessRepository } from "./access.repository.fake.js";

// The one kept non-scenario test: both adapters must honour the same behaviour.
type Harness = {
  repository: AccessRepository;
  companyId: string;
  addPerson(person: { userId: string; name: string; email: string }): Promise<void>;
  close(): Promise<void>;
};

const ana = { userId: "ana", name: "Ana", email: "ana@exemplo.test" };
const bruno = { userId: "bruno", name: "Bruno", email: "bruno@exemplo.test" };
const helena = { userId: "helena", name: "Helena", email: "helena@exemplo.test" };

function contract(name: string, createHarness: () => Promise<Harness>) {
  describe(name + " repository contract", () => {
    let harness: Harness;

    beforeEach(async () => {
      harness = await createHarness();
    });

    afterEach(async () => {
      await harness.close();
    });

    it("finds no access for a person who has none", async () => {
      expect(await harness.repository.findAccess("nobody")).toBeUndefined();
    });

    it("keeps the first access row for a person", async () => {
      await harness.addPerson(ana);
      await harness.repository.insertAccessIfAbsent(
        new Access(ana.userId, false, "pending", harness.companyId),
      );
      await harness.repository.insertAccessIfAbsent(
        new Access(ana.userId, false, "approved", harness.companyId),
      );

      expect((await harness.repository.findAccess(ana.userId))?.status).toBe("pending");
    });

    it("refuses a second administrator", async () => {
      await harness.addPerson(helena);
      await harness.addPerson(bruno);
      await harness.repository.insertAccessIfAbsent(
        new Access(helena.userId, true, "approved", harness.companyId),
      );
      await harness.repository.insertAccessIfAbsent(
        new Access(bruno.userId, true, "approved", harness.companyId),
      );

      expect(await harness.repository.hasAdministrator()).toBe(true);
      expect(await harness.repository.findAccess(bruno.userId)).toBeUndefined();
    });

    it("saves a status change and reads it back", async () => {
      await harness.addPerson(ana);
      await harness.repository.insertAccessIfAbsent(
        new Access(ana.userId, false, "pending", harness.companyId),
      );
      const current = await harness.repository.findAccess(ana.userId);

      await harness.repository.save(
        current!.approve(new Access(helena.userId, true, "approved", harness.companyId)),
      );

      expect((await harness.repository.findAccess(ana.userId))?.status).toBe("approved");
    });

    it("lists pending people first, then by name", async () => {
      await harness.addPerson(helena);
      await harness.addPerson(bruno);
      await harness.addPerson(ana);
      await harness.repository.insertAccessIfAbsent(
        new Access(helena.userId, true, "approved", harness.companyId),
      );
      await harness.repository.insertAccessIfAbsent(
        new Access(bruno.userId, false, "approved", harness.companyId),
      );
      await harness.repository.insertAccessIfAbsent(
        new Access(ana.userId, false, "pending", harness.companyId),
      );

      const names = (await harness.repository.listPeople()).map((person) => person.name);

      expect(names).toEqual(["Ana", "Bruno", "Helena"]);
    });

    it("reports the installation's company", async () => {
      expect(await harness.repository.installationCompanyId()).toBe(harness.companyId);
    });
  });
}

contract("In-memory", async () => {
  const companyId = randomUUID();
  const repository = new InMemoryAccessRepository(companyId);

  return {
    repository,
    companyId,
    addPerson: async (person) => repository.addPerson(person),
    close: async () => {},
  };
});

contract("Drizzle", async () => {
  const disposable = await createDisposableDatabase();

  const [company] = await disposable.db
    .insert(companyTable)
    .values({
      name: "Cairn de teste",
      morada: "Rua de teste, 1",
      locationLabel: "Leiria",
      latitude: 39.7436,
      longitude: -8.8071,
    })
    .returning({ id: companyTable.id });

  return {
    repository: new DrizzleAccessRepository(disposable.db),
    companyId: company!.id,
    addPerson: async (person) => {
      await disposable.db
        .insert(user)
        .values({ id: person.userId, name: person.name, email: person.email, emailVerified: true });
    },
    close: () => disposable.close(),
  };
});
