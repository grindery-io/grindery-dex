/// <reference types="cypress" />

/*
Automations page tests implementation progress
[ ] Shows trading automation details
[ ] Switches chain when selected
[ ] Fetches bot address suggestion from api
[ ] Delegates power
[ ] Shows if power was already delegated
*/

describe('Automations page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/sell/automations');
    cy.get('#connect-button').click();
    cy.acceptMetamaskAccess({
      allAccounts: false,
      signInSignature: true,
    });
    cy.wait(1000);
  });

  afterEach(() => {
    cy.get('#user-menu-button').click();
    cy.get('#disconnect-button').click();
    cy.disconnectMetamaskWalletFromAllDapps();
  });
});
