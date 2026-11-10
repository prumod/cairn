import { Access } from "../../../pages/access/access.js";
import type { AccessRepository, PersonAccess } from "../../../pages/access/access.js";

type FakePerson = { userId: string; name: string; email: string };

// In-memory adapter for the same contract as DrizzleAccessRepository (access.repository.contract.test.ts).
export class InMemoryAccessRepository implements AccessRepository {
  private readonly accesses = new Map<string, Access>();
  private readonly people = new Map<string, FakePerson>();

  constructor(private readonly companyId: string) {}

  addPerson(person: FakePerson) {
    this.people.set(person.userId, person);
  }

  async findAccess(userId: string) {
    return this.accesses.get(userId);
  }

  async insertAccessIfAbsent(access: Access) {
    if (this.accesses.has(access.userId)) return;

    if (access.administrator && (await this.hasAdministrator())) return;

    this.accesses.set(access.userId, access);
  }

  async hasAdministrator() {
    return [...this.accesses.values()].some((access) => access.administrator);
  }

  async save(access: Access) {
    this.accesses.set(access.userId, access);
  }

  // Same order as DrizzleAccessRepository.listPeople: pending first, then by name.
  async listPeople(): Promise<PersonAccess[]> {
    return [...this.people.values()]
      .flatMap((person) => {
        const access = this.accesses.get(person.userId);

        return access ? [{ ...person, access }] : [];
      })
      .sort(
        (left, right) =>
          Number(right.access.status === "pending") - Number(left.access.status === "pending") ||
          left.name.localeCompare(right.name),
      );
  }

  async installationCompanyId() {
    return this.companyId;
  }
}
