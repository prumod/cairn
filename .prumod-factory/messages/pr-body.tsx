/** The pull request description: plan, verdict with its checks, stake lapses, evidence and the test output tail. */
import { ChecksTable, Evidence, IssueRef, Lapses, Plan, RunRef, TestOutput, type On } from "factory";

export default (on: On) =>
  on("pr-body", ({ run, factory, evidenceBranch, evidenceNames, testOutput, lapses }) => {
    const verdict = run.verdict;
    const issue = run.ticket.number;
    const hasEvidence = evidenceBranch !== null && evidenceNames.length > 0;
    return (
      <>
        <p>
          <RunRef id={run.id} /> for <IssueRef number={issue} />. Closes <IssueRef number={issue} />.
        </p>
        {run.plan && (
          <>
            <h2>Plan</h2>
            <Plan plan={run.plan} withRiskReason />
          </>
        )}
        {verdict && (
          <>
            <h2>Verifier verdict</h2>
            <p>
              <strong>{String(verdict.verdict).toUpperCase()}</strong> on <code>{verdict.commit_sha}</code> by <code>{verdict.model}</code> (coder:{" "}
              <code>{factory.agentForState("IMPLEMENT").model}</code>). Tamper check: <strong>{verdict.tamper_check}</strong>.
            </p>
            <p>{verdict.summary}</p>
            <ChecksTable checks={verdict.checks} />
          </>
        )}
        <Lapses lapses={lapses} />
        {hasEvidence && <h2>Evidence</h2>}
        <Evidence repo={factory.targetRepo} branch={evidenceBranch} names={evidenceNames} />
        <TestOutput text={testOutput} />
        <p>A human reviews and merges this PR. The factory never merges.</p>
      </>
    );
  });
