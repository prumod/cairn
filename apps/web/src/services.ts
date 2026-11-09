import { type Database, createDb } from "@cairn/db";

import { ENV } from "./env.server";

export function getDb(): Database {
  return createDb(ENV);
}
