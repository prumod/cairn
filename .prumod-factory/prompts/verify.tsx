/** The VERIFY agent's prompt: its agent.md. */
import type { On } from "factory";

export default (on: On) => on("verify-prompt", ({ agent }) => <>{agent.prompt}</>);
