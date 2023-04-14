/// <reference types="cypress" />

/*
Automations page tests implementation progress
[ ] Shows trading automation details when chain is selected
[ ] Fetches bot address suggestion from api
[ ] Delegates power
[ ] Shows if power was already delegated
[ ] Shows coming soon page if user is not an admin
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

  it('Shows trading automation details when chain is selected', () => {
    cy.get('.SelectChainButton').click();
    cy.get('.ChainsList__card').first().click();
    cy.wait(2000);
    cy.allowMetamaskToAddAndSwitchNetwork();
    cy.wait(2000);
    cy.get('textarea[name="liquidityWalletABI"]').should('exist');
    cy.get('textarea[name="poolAbi"]').should('exist');
  });
});
