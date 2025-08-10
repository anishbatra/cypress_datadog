import { defineConfig } from "cypress";
import allureWriter from '@shelex/cypress-allure-plugin/writer';

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
      allureOmitPreviousAttemptScreenshots: true
  ,ddGlobalTags: 'team:qa,component:frontend'
    }
  },
});
