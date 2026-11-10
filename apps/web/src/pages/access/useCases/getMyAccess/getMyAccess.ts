import { Access } from "../../domain/access.js";
import type { AccessRepository } from "../../domain/accessRepository.js";

export type SignedInPerson = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
};

// Finds the caller's access row, or creates it once. The first verified e-mail equal to the
// bootstrap address becomes the administrator, and only while no administrator exists.
export class GetMyAccessUseCase {
  constructor(
    private readonly dependencies: {
      repository: AccessRepository;
      bootstrapEmail: string;
    },
  ) {}

  async execute(person: SignedInPerson): Promise<Access> {
    const { repository, bootstrapEmail } = this.dependencies;
    const existing = await repository.findAccess(person.id);

    if (existing) return existing;

    const companyId = await repository.installationCompanyId();
    const matchesBootstrap = person.emailVerified && person.email.toLowerCase() === bootstrapEmail;
    const administrator = matchesBootstrap && !(await repository.hasAdministrator());

    await repository.insertAccessIfAbsent(
      new Access(person.id, administrator, administrator ? "approved" : "pending", companyId),
    );

    const created = await repository.findAccess(person.id);

    if (created) return created;

    // A concurrent sign-in took the administrator slot (partial unique index): join as pending.
    await repository.insertAccessIfAbsent(new Access(person.id, false, "pending", companyId));

    const joined = await repository.findAccess(person.id);

    if (!joined) throw new Error("Access row was not created for " + person.id);

    return joined;
  }
}
