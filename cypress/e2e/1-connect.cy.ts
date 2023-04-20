/// <reference types="cypress" />

describe('Wallet connection', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000?popup=false');
  });

  afterEach(() => {
    cy.get('#user-menu-button').click();
    cy.get('#disconnect-button').click();
    cy.disconnectMetamaskWalletFromAllDapps();
  });

  it('Connects wallet on button click', () => {
    cy.get('#connect-button').click();
    cy.acceptMetamaskAccess({
      allAccounts: false,
      signInSignature: true,
    });
    cy.get('#user-address').should('have.text', '0x62E4...EFBE');
  });
});
