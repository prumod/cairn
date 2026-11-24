// The access feature's public root. Server modules import the domain from here; the feature's
// use cases import the domain files directly.
export {
  Access,
  AccessRefusal,
  accessStatuses,
  type AccessRefusalReason,
  type AccessStatus,
} from "./domain/access.entity.js";

export type { AccessRepository, PersonAccess } from "./domain/access.repository.js";
