/**
 * The IMPLEMENT agent's prompt: its agent.md; on a fix attempt, what the last attempt got wrong;
 * always, the rules of the run's enforced attachments, the paths it must not edit, the test command and the run's verification command, when
 * it has one. Also the prompt of each `--continue` round while that command still fails.
 */
import { CommandOutput, EnforcedRules, FixAttempt, ProtectedPaths, TestCommand, type On } from "factory";

export default (on: On) => {
  on("implement-prompt", ({ run, factory, agent, verification, enforced }) => (
    <>
      {agent.prompt}
      <FixAttempt attempt={run.fix_attempts} of={factory.limit("max_fix_attempts")} feedback={run.feedback} />
      <EnforcedRules rules={enforced} />
      <ProtectedPaths paths={factory.protectedPaths} />
      <TestCommand command={factory.testCommand} />
      {verification !== null && typeof verification === "object" ? (
        <>
          <h2>Done check</h2>
          <p>
            When you finish, the factory runs <code>{verification.run}</code> in /workspace/repo. The step is done only when it exits 0.
            Until then, the factory sends you its output and you keep working. Make it pass by doing the deliverable, never by changing
            the check.
          </p>
        </>
      ) : (
        ""
      )}
    </>
  ));
  on("goal-round-prompt", ({ check }) => (
    <>
      <h2>
        Done check failed: round {check.round} of {check.of}
      </h2>
      <p>
        The factory ran <code>{check.command}</code> in /workspace/repo after your last session. It exited {check.exitCode}. Its output
        ends with:
      </p>
      <CommandOutput text={check.output} />
      <p>
        Continue the same task until that command passes. Make it pass by doing the deliverable, never by changing the check. Then
        write the result file again.
      </p>
    </>
  ));
};
