---
name: playwright-api-tests
description: Use when writing, adding, or reviewing Playwright API tests in this repo — e.g. "add a test for endpoint X", "add a new resource client", "why is this test flaky", "review this spec file". Encodes this repo's request-fixture architecture (API clients, custom fixtures, zod schemas) plus official Playwright best practices for API testing, assertions, isolation, and CI.
---

# Playwright API tests

This repo has API smoke tests (no browser, no UI) against JSONPlaceholder using
Playwright's `request` fixture. Follow the architecture and rules below —
don't reinvent them per file.

## Architecture

```
tests/
  api/
    base-api-client.ts      # abstract class holding the APIRequestContext
    <resource>-api-client.ts  # one class per resource, methods = endpoints
    schemas.ts               # zod schemas + z.infer types (single source of truth)
  fixtures.ts                 # extends `test` with one fixture per API client
  <resource>.spec.ts          # specs import { test, expect } from './fixtures'
```

### Adding a new endpoint to an existing resource

1. Add a method to the resource's `*-api-client.ts` (e.g. `PostsApiClient.delete(id)`).
   Return `this.request.<verb>(...)` directly — don't parse the response inside the client.
2. If the response has a new shape, add/extend a zod schema in `schemas.ts`. Never
   hand-write a duplicate `interface` — derive types with `z.infer<typeof schema>`.
3. Write the test in the matching `<resource>.spec.ts` using the fixture, not raw `request`.

### Adding a brand-new resource

1. `tests/api/<resource>-api-client.ts` extending `BaseApiClient`.
2. Add its schema(s) to `schemas.ts`.
3. Register a fixture for it in `tests/fixtures.ts`.
4. Create `tests/<resource>.spec.ts`, `test.describe('<Resource> API', { tag: '@smoke' }, ...)`.

## Non-negotiable rules

- **Fixtures, not raw `request`.** Tests take `{ postsApi }` etc. from `./fixtures`,
  never `{ request }` directly — that's what makes endpoints/headers live in one place.
- **Relative paths only.** `baseURL` lives in `playwright.config.ts`
  (`API_BASE_URL` env override). Never hardcode `https://jsonplaceholder...` in a spec.
- **Validate shape with zod, not spot-checks.** `schema.parse(await response.json())`
  catches field drift; don't reintroduce manual `expect.objectContaining` for shape checks.
- **Web-first assertions.** Use `await expect(response).toBeOK()`, not
  `expect(response.ok()).toBeTruthy()` — the former dumps status+body on failure.
- **Tag via the `tag` option**, not by stuffing `@smoke` into the title string:
  `test.describe('Posts API', { tag: '@smoke' }, () => { ... })`.
- **Test isolation.** Every test must be runnable alone and in any order — no test
  should depend on data created by another. Use `faker` (`@faker-js/faker`) for
  generated payloads instead of hardcoded literals that could collide across runs.
- **Don't test third parties you don't control.** JSONPlaceholder itself is the
  system under test here, so hitting it directly is correct. If a test ever needs
  to depend on some *other* external service as an incidental dependency, mock it
  with Playwright's route/network API instead of hitting it live.
- **Keep `fullyParallel: true` valid** — never add ordering dependencies between
  specs or tests that would break parallel/sharded execution.

## Before calling work done

```
npx tsc --noEmit     # no type errors
npx playwright test  # full suite green
```

If a test is flaky or failing, open the trace (`trace: 'on-first-retry'` is already
configured) via `npx playwright show-report` rather than guessing from console output.

## CI-awareness already baked into `playwright.config.ts`

`forbidOnly`, `retries`, and the reporter are all gated on `process.env.CI` — don't
hardcode retry counts or reporters into individual tests; change the shared config instead.
