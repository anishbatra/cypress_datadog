import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'ozvjze',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    defaultCommandTimeout: 10000,
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
});
