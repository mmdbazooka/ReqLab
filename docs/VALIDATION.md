# Local validation — 2026-11-13

Verified on Node.js 24.22.1 with npm 11.9.0 and system Chromium.

| Check                                | Result              |
| ------------------------------------ | ------------------- |
| Frozen installation (`npm ci`)       | Passed              |
| ESLint                               | Passed, no warnings |
| Strict TypeScript / Next route types | Passed              |
| Production build                     | Passed              |
| Vitest                               | 8 passed            |
| Playwright                           | 7 passed            |
| Prettier                             | Passed              |

Browser tests exercised the production server in this environment. The Playwright configuration can also start a development server for CI or local use. Screenshots in this folder's `screenshots` directory were captured from the running product, including Persian/RTL, light theme, desktop, and mobile views.

The GitHub Actions workflow is committed; its remote run status has not been verified because access to `api.github.com` is blocked by the environment network policy. Git pushes to `main` are supported separately. The GitHub Projects script passed syntax and dry-run checks, but its remote preflight returned `Forbidden`; no remote Project creation is claimed. Enable the saved API network rule and retry with usable Projects authentication.

## Design refresh

The landing and dashboard were redesigned with independent visual identities. Confirmed 48 combined landing/dashboard layouts across English/Persian, light/dark, and 360/768/1440 px widths without document overflow. The new screenshots are generated with explicit stored preferences so light/dark filenames remain accurate regardless of each app’s defaults. See [Design](DESIGN.md) for the product-specific decisions.
