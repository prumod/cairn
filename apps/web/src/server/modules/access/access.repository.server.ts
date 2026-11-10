import { asc, eq, sql } from "drizzle-orm";
import { user } from "@cairn/db/schema/auth";
import type { Database } from "@cairn/db";
import { companyTable } from "../company/company.server.js";
import { Access, type AccessStatus } from "../../../pages/access/access.js";
import type { AccessRepository, PersonAccess } from "../../../pages/access/access.js";
import { accessTable } from "./persistence/accessTable.js";

function toAccess(row: typeof accessTable.$inferSelect) {
  if (!row.companyId) throw new Error("Access row has no company: " + row.userId);

  // SAFETY: the user_access_status_check constraint allows only the three access statuses.
  return new Access(row.userId, row.administrator, row.status as AccessStatus, row.companyId);
}

function toRow(access: Access) {
  return {
    userId: access.userId,
    administrator: access.administrator,
    status: access.status,
    // Kept in step with `status` until release B drops the boolean (expand-then-contract).
    approved: access.approved,
    companyId: access.companyId,
  };
}

export class DrizzleAccessRepository implements AccessRepository {
  constructor(private readonly db: Database) {}

  async findAccess(userId: string) {
    const [row] = await this.db
      .select()
      .from(accessTable)
      .where(eq(accessTable.userId, userId))
      .limit(1);

    return row ? toAccess(row) : undefined;
  }

  async insertAccessIfAbsent(access: Access) {
    await this.db.insert(accessTable).values(toRow(access)).onConflictDoNothing();
  }

  async hasAdministrator() {
    const rows = await this.db
      .select({ userId: accessTable.userId })
      .from(accessTable)
      .where(eq(accessTable.administrator, true))
      .limit(1);

    return rows.length > 0;
  }

  async save(access: Access) {
    await this.db
      .update(accessTable)
      .set(toRow(access))
      .where(eq(accessTable.userId, access.userId));
  }

  async listPeople(): Promise<PersonAccess[]> {
    const rows = await this.db
      .select({ userId: user.id, name: user.name, email: user.email, row: accessTable })
      .from(accessTable)
      .innerJoin(user, eq(user.id, accessTable.userId))
      .orderBy(sql`${accessTable.status} = 'pending' desc`, asc(user.name));

    return rows.map((row) => ({
      userId: row.userId,
      name: row.name,
      email: row.email,
      access: toAccess(row.row),
    }));
  }

  async installationCompanyId() {
    const [company] = await this.db.select({ id: companyTable.id }).from(companyTable).limit(1);

    if (!company) throw new Error("The installation has no company.");

    return company.id;
  }
}
