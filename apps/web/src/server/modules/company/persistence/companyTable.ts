import { sql } from "drizzle-orm";
import {
  check,
  doublePrecision,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/** The installation's company: an insert-only seed creates it, and no action deletes it (ADR 0002). */
export const companyTable = pgTable(
  "company",
  {
    // The code sets the id when it creates the company; the default is only a fallback.
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 200 }).notNull(),
    morada: varchar("morada", { length: 500 }).notNull(),
    // The place name shown for the company's location, for example «Leiria».
    locationLabel: varchar("location_label", { length: 100 }).notNull(),
    // WGS84 degrees, the same frame as the CAOP points.
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    // Search radius in whole kilometres, 1 to 200 inclusive.
    radiusKm: smallint("radius_km").notNull().default(50),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("company_latitude_range", sql`${table.latitude} BETWEEN -90 AND 90`),
    check("company_longitude_range", sql`${table.longitude} BETWEEN -180 AND 180`),
    check("company_radius_km_range", sql`${table.radiusKm} BETWEEN 1 AND 200`),
  ],
);

/** The company's alvará: one row per subcategoria, with the classe the alvará grants in it. */
export const companyAlvaraTable = pgTable(
  "company_alvara",
  {
    companyId: uuid("company_id")
      .notNull()
      .references(() => companyTable.id, { onDelete: "cascade" }),
    // An annex I subcategoria code from Lei 41/2015; the application validates it against the annex I list.
    subcategoria: text("subcategoria").notNull(),
    classe: smallint("classe").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.companyId, table.subcategoria] }),
    check("company_alvara_classe_range", sql`${table.classe} BETWEEN 1 AND 9`),
  ],
);
