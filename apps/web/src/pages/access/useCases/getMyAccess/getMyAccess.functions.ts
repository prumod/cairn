import { createServerFn } from "@tanstack/react-start";
import type { AccessStatus } from "../../domain/access.entity.js";
import { signedInContext } from "../context.server.js";
import { GetMyAccessUseCase } from "./getMyAccess.useCase.js";

export type MyAccessView = {
  userId: string;
  status: AccessStatus;
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
