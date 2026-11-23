/** Issue comment: the operator answered the run's questions through the dashboard. */
import type { On } from "factory";

export default (on: On) =>
  on("operator-answer", ({ run, answer }) => (
    <>
      <p>
        The operator answered through the dashboard. Run <code>{run.id}</code> continues with this answer:
      </p>
      <p>{answer}</p>
    </>
  ));
