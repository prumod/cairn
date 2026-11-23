/** Issue comment: TRIAGE accepted the issue and restates the deliverable before any coding starts. */
import type { On } from "factory";

export default (on: On) =>
  on("deliverable", ({ run, deliverable, verification }) => (
    <>
      <p>
        <strong>Deliverable:</strong> {deliverable}
      </p>
      {typeof verification === "string" ? (
        <p>
          <strong>Verification:</strong> {verification}
        </p>
      ) : (
        <p>
          <strong>Verification:</strong> <code>{verification.run}</code> exits 0.
        </p>
      )}
      <p>
        The factory is working on this issue (run <code>{run.id}</code>).
      </p>
    </>
  ));
