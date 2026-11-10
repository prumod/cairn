import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { DrizzleAccessRepository } from "../../../server/modules/access/access.repository.server.js";
import type { AccessRepository } from "../domain/accessRepository.js";
import { getRuntime } from "../../../server/runtime.server.js";

export type SignedInUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
};

// A refusal is a Response. TanStack Start returns a thrown Response to the caller unchanged.
function refusal(status: 401 | 403, message: string) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

// Checks the origin of a write (403) and the session (401). It does not check approval, because
// the caller may be pending or revoked. Used by the server function that finds or creates the
// caller's row.
export async function signedInContext(options: { write?: boolean } = {}) {
  setResponseHeader("Cache-Control", "no-store");

  const runtime = getRuntime();
  const request = getRequest();

  if (options.write && request.headers.get("origin") !== runtime.config.origin)
    throw refusal(403, "Origem não permitida.");

  const session = await runtime.auth.api.getSession({ headers: request.headers });

  if (!session) throw refusal(401, "Sem sessão iniciada.");

  // SAFETY: the session comes from better-auth's user table, which has the fields of SignedInUser.
  return {
    user: session.user as SignedInUser,
    bootstrapEmail: runtime.config.bootstrapAdministratorEmail,
    repository: new DrizzleAccessRepository(runtime.db),
  };
}

// Checks in order: the origin of a write (403), the session (401), then approval (403). It only
// reads the access row; GetMyAccess is the one place that creates rows.
export async function approvedContext(options: { write?: boolean; administrator?: boolean } = {}) {
  setResponseHeader("Cache-Control", "no-store");

  const runtime = getRuntime();
  const request = getRequest();

  if (options.write && request.headers.get("origin") !== runtime.config.origin)
    throw refusal(403, "Origem não permitida.");

  const session = await runtime.auth.api.getSession({ headers: request.headers });

  if (!session) throw refusal(401, "Sem sessão iniciada.");

  const repository: AccessRepository = new DrizzleAccessRepository(runtime.db);
  const access = await repository.findAccess(session.user.id);

  if (!access?.approved) throw refusal(403, "Acesso não aprovado.");

  if (options.administrator && !access.administrator) throw refusal(403, "Requer administrador.");

  // SAFETY: the session comes from better-auth's user table, which has the fields of SignedInUser.
  return { user: session.user as SignedInUser, access, repository };
}
