import { defineConfig } from "cypress";
import allureWriter from '@shelex/cypress-allure-plugin/writer';
// Properly import the @cypress/grep register function
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - package exports src path
import registerGrep from '@cypress/grep/src/plugin';

export default defineConfig({
  projectId: 'kxgj59',
  reporter: 'mocha-junit-reporter',
  reporterOptions: {
    mochaFile: 'cypress/results/results-[hash].xml',
    testsuitesTitle: 'Cypress Suite',
    toConsole: false
  },
  video: true,
  e2e: {
    setupNodeEvents(on, config) {
      // Allure plugin writer (generates allure-results)
      allureWriter(on, config);
  // Register @cypress/grep plugin to enable spec/test filtering before specs load
  // (Support file import only adds runtime commands; this line is required for filtering)
  // Register grep (mutates and returns config)
  // @ts-ignore - plugin types may be loose
  config = registerGrep(config) || config;
      // Optionally write a tags file for Datadog (custom usage) – demonstrates dynamic tagging
      on('before:run', () => {
        const fs = require('fs');
        const tagsFile = 'cypress/results/datadog-tags.txt';
        try {
          fs.mkdirSync('cypress/results', { recursive: true });
          const branch = process.env.GITHUB_REF_NAME || process.env.BRANCH_NAME || 'local';
          const commit = process.env.GITHUB_SHA || 'local';
            const service = process.env.DD_SERVICE || 'cypress-e2e';
          const envTag = process.env.DD_ENV || 'ci';
          fs.writeFileSync(tagsFile, `service:${service},env:${envTag},branch:${branch},commit:${commit}`);
        } catch (e) {
          console.warn('Failed to write datadog tags file', e);
        }
      });
  return config;
    },
    defaultCommandTimeout: 10000,
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    env: {
      allure: true,
      allureResultsPath: 'allure-results',
      allureLogCypress: true,
      allureOmitPreviousAttemptScreenshots: true,
      ddGlobalTags: 'team:qa,component:frontend',
      // cypress-grep defaults
      grepFilterSpecs: true,
      grepOmitFiltered: true
    }
  },
});
