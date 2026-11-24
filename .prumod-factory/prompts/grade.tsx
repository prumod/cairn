/** The GRADE agent's prompt: its agent.md. The rules it grades are in its input files. */
import type { On } from "factory";

export default (on: On) => on("grade-prompt", ({ agent }) => <>{agent.prompt}</>);
