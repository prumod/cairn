# One company per installation, with company-scoped data

## Status

Accepted

## Context

Cairn serves one company today. The product owner puts the chance of serving several companies from one installation later at 55%. Global settings for the company would be the part a multi-company change has to remove.

## Decision

Each installation has exactly one company, and the app has no action to create or delete a company. Even so, the data model treats the company as a record with its own identity:

- The company profile is a stored record that the deployment seeds once. It is not global configuration.
- Each user belongs to exactly one company.
- Concursos, lotes and their collection are public data that all companies share. Nothing that depends on a company is stored on them.
- Everything that depends on a company is scoped by company: the profile, distances, the priority ordering, comments, citations and assistant conversations. Comments, citations and conversations are also private to their person: the one who wrote them, or who sent the request in which the assistant wrote them ([Where do unsent comments and citations live?](https://github.com/prumod/cairn/issues/200)). Assistant conversations and their steps stay in the same company-scoped database as the rest, not in a separate store per conversation such as a Durable Object ([Where does the assistant's loop run?](https://github.com/prumod/cairn/issues/198)).
- Distance is computed from the viewing company's location when it is read, never stored.
- The administrator who approves access stays installation-wide. The split into a platform administrator and a company administrator waits for multi-company support.

The rejected alternative was a single global profile in configuration. It is simpler today, but a second company would then need a data migration and a rewrite of every query that reads the profile.

## Consequences

- Queries and use cases take a company identity, even though only one exists.
- Supporting several companies later needs onboarding, a company-administrator role and authorization, but no change to the data model.
