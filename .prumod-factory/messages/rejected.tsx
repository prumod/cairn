/** Issue comment: the factory will not work on the issue. */
import type { On } from "factory";

export default (on: On) =>
  on("rejected", ({ run, reason }) => (
    <p>
      The factory will not work on this issue (run <code>{run.id}</code>): {reason}
    </p>
  ));
