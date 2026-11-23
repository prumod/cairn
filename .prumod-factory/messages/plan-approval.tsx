/** Issue comment: a plan whose risk needs a person's approval. */
import { Plan, type On } from "factory";

export default (on: On) =>
  on("plan-approval", ({ run }) => {
    const reason = run.plan?.risk_reason ? ` (${run.plan.risk_reason})` : "";
    return (
      <>
        <p>
          The factory's plan for this issue is rated <strong>{run.plan?.risk}</strong> risk{reason}.
        </p>
        <Plan plan={run.plan} />
        <p>
          Comment <code>/factory approve</code> to let the factory implement it.
        </p>
      </>
    );
  });
