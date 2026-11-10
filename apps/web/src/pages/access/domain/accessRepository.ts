import type { Access } from "./access.js";

export type PersonAccess = {
  userId: string;
  name: string;
  email: string;
  access: Access;
};

export interface AccessRepository {
  findAccess(userId: string): Promise<Access | undefined>;
  // Inserts the row unless one already exists for the person, or a unique index refuses it (the
  // partial index allows one administrator). Returns nothing; callers read the row back.
  insertAccessIfAbsent(access: Access): Promise<void>;
  hasAdministrator(): Promise<boolean>;
  save(access: Access): Promise<void>;
  listPeople(): Promise<PersonAccess[]>;
  installationCompanyId(): Promise<string>;
}
