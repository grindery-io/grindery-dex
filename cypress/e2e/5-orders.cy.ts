/// <reference types="cypress" />

/*
Order page tests implementation progress
[ ] Shows orders
[ ] Sends an order
[ ] Updates the order status after sending
[ ] Shows coming soon page if user is not an admin
*/

describe('Orders page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/sell/orders');
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
