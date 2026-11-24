import { createServerFn } from "@tanstack/react-start";
import type { AccessStatus } from "../../domain/access.entity.js";
import { approvedContext } from "../context.server.js";
import { ListPeopleUseCase } from "./listPeople.useCase.js";

export type PersonView = {
  userId: string;
  name: string;
  email: string;
  status: AccessStatus;
  administrator: boolean;
};

export const listPeople = createServerFn({ method: "GET" }).handler(
  async (): Promise<PersonView[]> => {
    const context = await approvedContext({ administrator: true });
    const people = await new ListPeopleUseCase({ repository: context.repository }).execute();

    return people.map((person) => ({
      userId: person.userId,
      name: person.name,
      email: person.email,
      status: person.access.status,
      administrator: person.access.administrator,
    }));
  },
);
