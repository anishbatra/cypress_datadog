describe("My First Test", () => {
  it("Visits the Demo Site", () => {
  // Example Allure labels (also visible in rich test reporting)
  // @ts-ignore
  cy.allure().label('team','qa').label('component','frontend').severity('normal');
    cy.visit("https://example.cypress.io", { timeout: 10008 });
    cy.contains("type").click({ timeout: 10000 });
    // Should be on a new URL which
    // includes '/commands/actions'
    cy.url().should("include", "/commands/actions");
    // Get an input, type into it
    cy.get(".action-email", { timeout: 10000 }).type("fake@email.com");

    //  Verify that the value has been updated
    cy.get(".action-email", { timeout: 10000 }).should("have.value", "fake@email.com");
  });

  it("Visits the Demo Site", () => {
  // Example Allure labels (also visible in rich test reporting)
  // @ts-ignore
  cy.allure().label('team','qa').label('component','frontend').severity('normal');
    cy.visit("https://example.cypress.io", { timeout: 10008 });
    cy.contains("type").click({ timeout: 10000 });
    // Should be on a new URL which
    // includes '/commands/actions'
    cy.url().should("include", "/commands/actions");
    // Get an input, type into it
    cy.get(".action-email", { timeout: 10000 }).type("fake@email.com");

    //  Verify that the value has been updated
    cy.get(".action-email", { timeout: 10000 }).should("have.value", "fake@email.com");
  });

  it("Visits the Demo Site", () => {
  // Example Allure labels (also visible in rich test reporting)
  // @ts-ignore
  cy.allure().label('team','qa').label('component','frontend').severity('normal');
    cy.visit("https://example.cypress.io", { timeout: 10008 });
    cy.contains("type").click({ timeout: 10000 });
    // Should be on a new URL which
    // includes '/commands/actions'
    cy.url().should("include", "/commands/actions");
    // Get an input, type into it
    cy.get(".action-email", { timeout: 10000 }).type("fake@email.com");

    //  Verify that the value has been updated
    cy.get(".action-email", { timeout: 10000 }).should("have.value", "fake@email.com");
  });

  it("Visits the Demo Site", () => {
  // Example Allure labels (also visible in rich test reporting)
  // @ts-ignore
  cy.allure().label('team','qa').label('component','frontend').severity('normal');
    cy.visit("https://example.cypress.io", { timeout: 10008 });
    cy.contains("type").click({ timeout: 10000 });
    // Should be on a new URL which
    // includes '/commands/actions'
    cy.url().should("include", "/commands/actions");
    // Get an input, type into it
    cy.get(".action-email", { timeout: 10000 }).type("fake@email.com");

    //  Verify that the value has been updated
    cy.get(".action-email", { timeout: 10000 }).should("have.value", "fake@email.com");
  });
  it("Visits the Demo Site", () => {
  // Example Allure labels (also visible in rich test reporting)
  // @ts-ignore
  cy.allure().label('team','qa').label('component','frontend').severity('normal');
    cy.visit("https://example.cypress.io", { timeout: 10008 });
    cy.contains("type").click({ timeout: 10000 });
    // Should be on a new URL which
    // includes '/commands/actions'
    cy.url().should("include", "/commands/actions");
    // Get an input, type into it
    cy.get(".action-email", { timeout: 10000 }).type("fake@email.com");

    //  Verify that the value has been updated
    cy.get(".action-email", { timeout: 10000 }).should("have.value", "fake12@email.com");
  });
  it("Visits the Demo Site", () => {
  // Example Allure labels (also visible in rich test reporting)
  // @ts-ignore
  cy.allure().label('team','qa').label('component','frontend').severity('normal');
    cy.visit("https://example.cypress.io", { timeout: 10008 });
    cy.contains("type").click({ timeout: 10000 });
    // Should be on a new URL which
    // includes '/commands/actions'
    cy.url().should("include", "/commands/actions");
    // Get an input, type into it
    cy.get(".action-email", { timeout: 10000 }).type("fake@email.com");

    //  Verify that the value has been updated
    cy.get(".action-email", { timeout: 10000 }).should("have.value", "fake123@email.com");
  });
});
