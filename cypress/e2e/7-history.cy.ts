/// <reference types="cypress" />

describe('Orders history page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/history');
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

  it('Shows orders list', () => {
    cy.get('.OrderCard').should('exist');
  });

  it('Show no orders found message if no orders exist', () => {
    cy.get('#user-menu-button').click();
    cy.get('#disconnect-button').click();
    cy.disconnectMetamaskWalletFromAllDapps();
    cy.resetMetamaskAccount();
    cy.wait(1000);
    cy.switchMetamaskAccount(2);
    cy.get('#connect-button').click();
    cy.acceptMetamaskAccess({
      allAccounts: false,
      signInSignature: true,
    });
    cy.wait(1000);
    cy.get('#not-found-message').first().should('have.text', 'No orders found');
    cy.get('#user-menu-button').click();
    cy.get('#disconnect-button').click();
    cy.disconnectMetamaskWalletFromAllDapps();
    cy.switchMetamaskAccount(1);
    cy.get('#connect-button').click();
    cy.acceptMetamaskAccess({
      allAccounts: false,
      signInSignature: true,
    });
    cy.wait(1000);
  });
});
