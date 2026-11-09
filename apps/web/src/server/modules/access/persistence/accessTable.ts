import { pgTable, text, boolean, uuid } from "drizzle-orm/pg-core";
import { user } from "@cairn/db/schema/auth";
import { companyTable } from "../../company/company.server.js";

export const accessTable = pgTable("user_access", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  administrator: boolean("administrator").notNull().default(false),
  approved: boolean("approved").notNull().default(false),
  // Null only until release B of #197 sets NOT NULL; the company seed fills existing rows.
  companyId: uuid("company_id").references(() => companyTable.id, { onDelete: "restrict" }),
});
