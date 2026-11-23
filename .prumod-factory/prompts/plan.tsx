/** The PLAN agent's prompt: its agent.md; when the run already has a plan, the operator's request to change it. */
import type { On } from "factory";

export default (on: On) =>
  on("plan-prompt", ({ run, agent }) => (
    <>
      {agent.prompt}
      {run.plan !== null && (
        <>
          <h2>The operator asked for changes</h2>
          <p>
            You wrote a plan for this run earlier, and the operator sent it back. Their feedback is the newest comment in{" "}
            <code>/workspace/.factory/ticket.json</code> with <code>from_factory</code> set to false and <code>author</code> set to <code>operator</code>. Write a
            new plan that addresses that feedback. Do not hand back the earlier plan unchanged.
          </p>
        </>
      )}
    </>
  ));
