import type { AccessRepository, PersonAccess } from "../../domain/accessRepository.js";

// Pending people first, then by name. The repository applies the order.
export class ListPeopleUseCase {
  constructor(private readonly dependencies: { repository: AccessRepository }) {}

  execute(): Promise<PersonAccess[]> {
    return this.dependencies.repository.listPeople();
  }
}
