import { getDb } from "../services.js";
import { ENV } from "../env.server.js";
import { readConfig } from "./config.server.js";

export function getRuntime() {
  return { config: readConfig(ENV), db: getDb() };
}
