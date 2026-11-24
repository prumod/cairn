import { sql } from "drizzle-orm";
import { boolean, check, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { user } from "@cairn/db/schema/auth";
import { companyTable } from "../../company/company.server.js";

export const accessTable = pgTable(
  "user_access",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    administrator: boolean("administrator").notNull().default(false),
    // Replaced by `status` in release B of #197; kept in step with it until then.
    approved: boolean("approved").notNull().default(false),
    status: text("status").notNull().default("pending"),
    // Null only until release B of #197 sets NOT NULL; the company seed fills existing rows.
    companyId: uuid("company_id").references(() => companyTable.id, { onDelete: "restrict" }),
  },
  (table) => [
    // Keep the list in step with accessStatuses in access.entity.ts.
    check("user_access_status_check", sql`${table.status} in ('pending', 'approved', 'revoked')`),
    // At most one administrator: every row in this partial index has the same key, true.
    uniqueIndex("user_access_one_administrator")
      .on(table.administrator)
      .where(sql`${table.administrator}`),
  ],
);
