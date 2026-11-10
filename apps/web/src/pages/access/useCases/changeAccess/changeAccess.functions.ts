import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { AccessRefusal } from "../../domain/access.js";
import { approvedContext } from "../context.server.js";
import { ChangeAccessUseCase, PersonNotFound } from "./changeAccess.js";

const ChangeAccessInput = z.object({
  userId: z.string().min(1),
  action: z.enum(["approve", "revoke"]),
});

function refused(status: number, error: string) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export const changeAccess = createServerFn({ method: "POST" })
  .validator(ChangeAccessInput)
  .handler(async ({ data }) => {
    const context = await approvedContext({ write: true, administrator: true });

    try {
      const changed = await new ChangeAccessUseCase({
        repository: context.repository,
        actor: context.access,
      }).execute(data);

      return { userId: changed.userId, status: changed.status };
    } catch (error) {
      if (error instanceof PersonNotFound) throw refused(404, "Pessoa não encontrada.");

      if (error instanceof AccessRefusal)
        throw refused(
          403,
          error.reason === "selfChange"
            ? "Não pode alterar o seu acesso."
            : "Requer administrador.",
        );

      throw error;
    }
  });
