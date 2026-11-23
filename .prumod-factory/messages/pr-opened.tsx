/** Issue comment: the link to the pull request. */
import type { On } from "factory";

export default (on: On) =>
  on("pr-opened", ({ run }) => (
    <p>
      The factory opened {run.pr?.url} for this issue (run <code>{run.id}</code>). A human reviews and merges it.
    </p>
  ));
