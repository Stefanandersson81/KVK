# Playwright + TypeScript POM Starter

Opinionated Playwright starter showing a simple Page Object Model (POM) structure using TypeScript.

## Prerequisites
- Node.js 18+ and npm installed locally.

## Install & run
1) Install dependencies and browsers:
```bash
npm install
npx playwright install chromium
```
2) Run tests:
```bash
npm test            # headless default
npm run test:headed # headed mode for debugging
npm run test:ui     # Playwright UI mode
npm run test:report # open last HTML report
```

## Project layout
- `playwright.config.ts` – shared Playwright settings (projects, baseURL, tracing/reporters).
- `src/pages` – page objects (e.g., `TodoPage` wraps demo TodoMVC interactions).
- `src/fixtures/testFixtures.ts` – custom fixtures injecting page objects per test.
- `tests` – specs consuming the fixtures (`todo.spec.ts` exercises the POM).
- `tsconfig.json` – TypeScript compiler options.

## Extending the POM
1) Create a new page object in `src/pages`, encapsulating locators + actions.
2) Add it to `src/fixtures/testFixtures.ts` to expose it as a fixture.
3) Consume the fixture in specs under `tests/`, keeping assertions inside tests and navigation/actions inside page objects.

The starter uses the Playwright TodoMVC demo (`https://demo.playwright.dev/todomvc`) to illustrate POM usage. Swap `baseURL` in `playwright.config.ts` and adjust page objects as needed for your app.
