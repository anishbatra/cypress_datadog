## Cypress E2E Test Automation Project

End‑to‑end test suite using Cypress + TypeScript with:
* Cypress Cloud recording & parallelization ready
* JUnit (mocha-junit-reporter) output
* Allure reporting (HTML) published to GitHub Pages
* GitHub Actions CI pipeline (Chrome headless)
* Optional email notifications (SMTP) – guidance included
* Path aliases via TypeScript (baseUrl + @e2e, @support, @fixtures)

---
## 1. Prerequisites
* Node.js 20+
* npm (comes with Node)
* GitHub repository access (write) for Actions & Pages
* (Optional) Cypress Cloud account: https://cloud.cypress.io
* (Optional) Gmail (or other SMTP) account for email notifications (or alternative provider)

---
## 2. Install & Run Locally
```bash
git clone <repo-url>
cd cypress_datadog
npm ci
npx cypress open          # interactive
npx cypress run            # headless (default Electron)
npx cypress run --browser chrome  # headless Chrome
```

Package scripts:
```bash
npm test          # cypress run
npm run cy:open   # cypress open
npm run cy:run    # cypress run
npm run type-check
```

---
## 3. Project Structure (key parts)
```
cypress.config.ts              # Cypress + reporter + Allure config
cypress/e2e/*.cy.ts            # Specs
cypress/support/e2e.ts         # Global support; imports commands & Allure plugin
cypress/support/commands.ts    # Custom commands placeholder
tsconfig.json                  # TypeScript compilerOptions + path aliases
.github/workflows/cypress.yml  # CI pipeline with Pages deploy
```

Path Aliases (from tsconfig.json):
* `@e2e/*` -> `cypress/e2e/*`
* `@support/*` -> `cypress/support/*`
* `@fixtures/*` -> `cypress/fixtures/*`
* `@config` -> `cypress.config.ts`

Usage example:
```ts
import '@support/commands';
import data from '@fixtures/example.json';
```

---
## 4. Cypress Configuration Highlights
`cypress.config.ts` includes:
* `projectId` for Cypress Cloud (public identifier – safe to commit)
* `reporter: mocha-junit-reporter` with output pattern `cypress/results/results-[hash].xml`
* Allure plugin writer in `setupNodeEvents`
* `env.allure: true` enabling Allure result generation
* `video: true` ensures video artifacts
* `specPattern` targeting `cypress/e2e/**/*.cy.{js,jsx,ts,tsx}`

---
## 5. Cypress Cloud Integration
1. Open Cypress UI and link project: `npx cypress open` → “Set up project to record” (or use existing `projectId`).
2. Get Record Key from Cloud: Project Settings → “Record Key”.
3. Add GitHub Actions secret: `CYPRESS_RECORD_KEY`.
4. CI run command uses: `npx cypress run --browser chrome --record --tag ci --group github-run --ci-build-id ${{ github.run_id }}`.
5. To enable parallelization (after you have multiple specs & runners):
	 * Add matrix to workflow
	 * Use `--parallel --group shard-X --ci-build-id ${{ github.run_id }}` across runners.

Local recorded run example:
```bash
export CYPRESS_RECORD_KEY=<your_key>
npx cypress run --record --key $CYPRESS_RECORD_KEY --tag local --group local-run
```

Troubleshooting Cloud:
* 404 / project not found: regenerate / update `projectId`.
* “Run already complete”: reused `--ci-build-id` – ensure uniqueness per CI run.
* Parallel not splitting: need >1 spec; long spec times may skew balancing.

---
## 6. JUnit Reporting
Provided by `mocha-junit-reporter` (dev dependency).
XML files stored under `cypress/results/` and uploaded as CI artifact.
Usage in other systems (e.g., test analytics) – download artifact from the Actions run.

---
## 7. Allure Reporting
Dependencies:
* `@shelex/cypress-allure-plugin`
* `allure-commandline`

Config pieces:
* Plugin imported in `support/e2e.ts`: `import '@shelex/cypress-allure-plugin';`
* Writer called in `setupNodeEvents`: `allureWriter(on, config)`.
* Allure results default path: `allure-results` (ignored by Git).
* HTML report generated in CI: `npx allure generate --clean allure-results -o allure-report`.

Local usage:
```bash
npx cypress run
npx allure generate --clean allure-results -o allure-report
npx allure open allure-report
```

If no results appear:
* Ensure env `allure: true`.
* Confirm plugin import in support file.
* Run a test with at least one assertion.
* Optionally enrich metadata:
	```ts
	// inside a test
	// @ts-ignore
	cy.allure().feature('Demo').story('Kitchen Sink');
	```

---
## 8. GitHub Actions Workflow Overview
File: `.github/workflows/cypress.yml`

Pipeline stages:
1. Checkout & Node setup (Node 20, npm cache)
2. Install dependencies + create artifact directories
3. Type check (`tsc --noEmit`)
4. Run Cypress (Chrome headless, record to Cloud if key present)
5. Debug listing of artifacts
6. Upload videos, screenshots, JUnit XML
7. Generate Allure report (skip with placeholder if no results)
8. Upload Allure artifacts
9. Upload Allure report as Pages artifact (if configured) & separate deploy job publishes to Pages
10. (Optional) Email notification step (requires SMTP secrets)

Key environment / secrets (add in GitHub repo Settings > Secrets and variables > Actions):
* `CYPRESS_RECORD_KEY` – from Cypress Cloud (for recording)
* (Optional email) `SMTP_USERNAME`, `SMTP_APP_PASSWORD` or provider-specific keys

Browser selection: `--browser chrome` in CI command. Override locally via CLI flag.

Parallelization (future): add matrix like:
```yaml
strategy:
	fail-fast: false
	matrix:
		shard: [1,2]
```
Then per step command:
```yaml
command: npx cypress run --browser chrome --record --parallel --group shard-${{ matrix.shard }} --ci-build-id ${{ github.run_id }}
```

---
## 9. GitHub Pages (Allure Report Publishing)
* Allure HTML (`allure-report/`) uploaded and deployed to Pages.
* Expected URL pattern: `https://<github-username>.github.io/<repo-name>/`
* The Pages deployment job sets `environment.url` (visible in run summary).
* Placeholder index created if no Allure results to avoid 404.

To enable Pages if first run:
1. Push to main and let workflow finish.
2. Repository Settings > Pages should show status configured by GitHub Actions.

---
## 10. Email Notifications (Optional)
Using `dawidd6/action-send-mail@v3` (example). Requirements:
* SMTP credentials as secrets.
* For Gmail: enable 2FA, create an App Password (do NOT disable 2FA), store as secret.

Example step (template):
```yaml
- name: Email Allure link
	if: always()
	uses: dawidd6/action-send-mail@v3
	with:
		server_address: smtp.gmail.com
		server_port: 465
		secure: true
		username: ${{ secrets.SMTP_USERNAME }} # full email
		password: ${{ secrets.SMTP_APP_PASSWORD }}
		subject: "Allure Report #${{ github.run_number }}"
		from: "QA Automation <${{ secrets.SMTP_USERNAME }}>"
		to: "stakeholder1@example.com"
		content_type: text/html
		body: >
			<p>Allure report: <a href="${{ steps.deployment.outputs.page_url }}">Open</a></p>
```

Common SMTP Issues:
* 535 Invalid login: wrong app password / username mismatch / trailing spaces.
* 530 Authentication Required: missing STARTTLS or wrong port pairing.
* Gmail app password revoked after password or 2FA changes – regenerate.

Alternative Providers: SendGrid, Mailgun, SES, Resend (token-based and CI-friendly).

---
## 11. Artifacts & Outputs
| Artifact | Source | Purpose |
|----------|--------|---------|
| cypress-artifacts | videos & screenshots | Debugging failed tests |
| cypress-junit | cypress/results/*.xml | Integration with test report tools |
| allure-results | allure-results/*.json | Raw Allure data (optional) |
| allure-report | allure-report/** | Published HTML report |

---
## 12. Troubleshooting Quick Reference
| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| No JUnit XML uploaded | Reporter not configured | Confirm `reporter` & path |
| Empty Allure report | No results generated | Ensure plugin import & env.allure |
| Cypress Cloud 404 | projectId mismatch | Re-link project / update config |
| Parallel not splitting | Only one spec | Add more specs |
| Gmail 535 error | Bad app password / from mismatch | Regenerate app password & verify secrets |
| No videos | video disabled | Ensure `video: true` |

---
## 13. Extending the Framework
Ideas:
* Add ESLint + Prettier for code quality
* Integrate code coverage (nyc + @cypress/code-coverage)
* Add tagging strategy for selective spec runs (env-based filters)
* Add Slack webhook notifications post-deploy
* Introduce parallel shards in CI
* Add visual regression (Percy / Happo)

---
## 14. License
ISC (see package.json)

---
## 15. Quick Commands Cheat Sheet
```bash
# Run in Chrome headless
npx cypress run --browser chrome

# Record to Cloud locally
export CYPRESS_RECORD_KEY=XXXXX
npx cypress run --record --key $CYPRESS_RECORD_KEY --tag local --group local

# Generate Allure after run
npx allure generate --clean allure-results -o allure-report
npx allure open allure-report

# Type check
npm run type-check
```

---
## 16. Support
Open an issue or PR with improvements (parallel matrix, coverage, etc.).

---
Happy testing!
