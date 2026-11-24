---
triggers:
  - provider: github
    event: issue_assigned
    filter:
      repos: [prumod/cairn]
      assignees: [TiagoJacinto]
      labels: ["factory:Cairn"]
---
<!-- Copied from warpdotdev/warp-factory-examples, example 12 (MIT License, Copyright (C) 2026 Denver Technologies, Inc.). See LICENSES/warp-factory-examples.txt. -->
A maintainer assigned an issue carrying this factory's routing label to the
factory. The assignment is the whole request. Run the scope check, restate
the deliverable on the issue, and coordinate implementation through to a pull
request. Post progress
as comments on the issue. If the issue is not actionable, say what is missing
in one comment and stop.
