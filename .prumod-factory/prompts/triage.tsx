/** The TRIAGE agent's prompt: its agent.md and the instruction of the automation that started the run. */
import type { On } from "factory";

export default (on: On) =>
  on("triage-prompt", ({ run, factory, agent }) => (
    <>
      {agent.prompt}
      <h2>Automation</h2>
      {factory.issueTrigger(run.automation!).instruction}
    </>
  ));
