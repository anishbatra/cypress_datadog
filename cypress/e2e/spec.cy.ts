describe("My First Test", () => {
  it("Visits the Kitchen Sink", () => {
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
});
