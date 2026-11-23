/** Issue comment: TRIAGE needs answers before it can start. */
import { Questions, type On } from "factory";

export default (on: On) =>
  on("needs-info", ({ run, questions }) => (
    <>
      <p>The factory needs more information before it can work on this issue:</p>
      <Questions items={questions} />
      <p>
        Reply in a comment and the run (<code>{run.id}</code>) continues.
      </p>
    </>
  ));
