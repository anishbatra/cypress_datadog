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
    }
  },
});
