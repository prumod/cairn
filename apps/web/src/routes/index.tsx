import { createFileRoute } from "@tanstack/react-router";
import { AccessPage } from "../pages/access/access.page.js";

export const Route = createFileRoute("/")({
  component: AccessPage,
});
