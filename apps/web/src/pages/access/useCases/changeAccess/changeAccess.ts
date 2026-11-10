import type { Access } from "../../domain/access.js";
import type { AccessRepository } from "../../domain/accessRepository.js";

export type AccessAction = "approve" | "revoke";

export class PersonNotFound extends Error {
  constructor() {
    super("No person has that id.");
  }
}

// Approves or revokes another person's access. The domain refuses self-changes and changes by a
// non-administrator (AccessRefusal); this use case only loads and saves.
export class ChangeAccessUseCase {
  constructor(
    private readonly dependencies: {
      repository: AccessRepository;
      actor: Access;
    },
  ) {}

  async execute(input: { userId: string; action: AccessAction }) {
    const target = await this.dependencies.repository.findAccess(input.userId);

    if (!target) throw new PersonNotFound();

    const changed =
      input.action === "approve"
        ? target.approve(this.dependencies.actor)
        : target.revoke(this.dependencies.actor);

    await this.dependencies.repository.save(changed);

    return changed;
  }
}
