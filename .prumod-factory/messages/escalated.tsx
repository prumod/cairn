/** Issue comment: the run stops and needs a person. */
import type { On } from "factory";

export default (on: On) =>
  on("escalated", ({ run, reason }) => (
    <p>
      The factory stopped run <code>{run.id}</code> and needs a person: {reason}
    </p>
  ));
