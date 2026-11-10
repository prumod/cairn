import { createServerFn } from "@tanstack/react-start";
import { signedInContext } from "../context.server.js";
import { GetMyAccessUseCase } from "./getMyAccess.js";

export type MyAccessView = {
  userId: string;
  status: "pending" | "approved" | "revoked";
  administrator: boolean;
  name: string;
  email: string;
};

export const getMyAccess = createServerFn({ method: "POST" }).handler(
  async (): Promise<MyAccessView> => {
    const context = await signedInContext({ write: true });

    const access = await new GetMyAccessUseCase({
      repository: context.repository,
      bootstrapEmail: context.bootstrapEmail,
    }).execute(context.user);

    return {
      userId: context.user.id,
      status: access.status,
      administrator: access.administrator,
      name: context.user.name,
      email: context.user.email,
    };
  },
);
