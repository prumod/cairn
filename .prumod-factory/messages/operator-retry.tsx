/** Issue comment: the operator retries a run through the dashboard, with a note for the agents. */
import type { On } from "factory";

export default (on: On) =>
  on("operator-retry", ({ run, note }) => (
    <>
      <p>
        The operator retried run <code>{run.id}</code> through the dashboard, and a new run starts. Note for the agents:
      </p>
      <p>{note}</p>
    </>
  ));
