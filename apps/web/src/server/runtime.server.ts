import { createAuth } from "@cairn/auth";
import { getDb } from "../services.js";
import { ENV } from "../env.server.js";
import { readConfig } from "./config.server.js";

export function getRuntime() {
  const config = readConfig(ENV);
  const db = getDb();

  return { config, db, auth: createAuth(config.auth, db) };
}
