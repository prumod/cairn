---
check: A domain value in the change is an Effect `Brand`, built through its constructor, in one of the two shapes below. A bare `string`/`number` or an unbranded object that stands for a domain value is a violation.
suspended: false
---
A domain value is an Effect `Brand` that validates in its constructor.

A value object with one main value and related properties is a `Brand.Branded` readonly object with a `value` field:

```ts
import { Brand } from "effect"

type Password = Brand.Branded<
  Readonly<{ value: string; encrypted?: boolean }>,
  "Password"
>

const Password = Brand.make<Password>(({ value }) => {
  if (value.length < 12) {
    return "Password must have at least 12 characters"
  }

  return true
})

const password = Password({ value: "my-secure-password" })
```

A single-value domain value brands the primitive itself:

```ts
import { Brand } from "effect"

type Password = Brand.Branded<string, "Password">

const Password = Brand.make<Password>((value) => {
  if (value.length < 12) {
    return "Password must have at least 12 characters"
  }

  return true
})

const password = Password("my-secure-password")
```
