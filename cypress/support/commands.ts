// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Declare global namespace for TypeScript support
declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom command types here
      // Example:
      // login(email: string, password: string): Chainable<Element>
    }
  }
}

// Export to make this file a module and avoid global scope pollution
export {};

//
// -- This is a parent command --
// Cypress.Commands.add('login', (email: string, password: string) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
