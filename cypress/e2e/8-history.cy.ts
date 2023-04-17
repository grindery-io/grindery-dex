/// <reference types="cypress" />

describe('Orders page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/buy/trade/history');
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

  it('Shows order history details', () => {
    cy.get('.OrderCard').should('exist');
  });

  it('Returns to trade page', () => {
    cy.get('button.MuiIconButton-root').eq(1).click();
    cy.get('.PageCardHeader__typography').first().should('have.text', 'Trade');
  });

  it('Show no orders history found', () => {
    cy.get('#user-menu-button').click();
    cy.get('#disconnect-button').click();
    cy.disconnectMetamaskWalletFromAllDapps();
    cy.resetMetamaskAccount();
    cy.wait(1000);
    cy.importMetamaskAccount(Cypress.env('CYPRESS_NON_ADMIN_IMPORT_KEY'));
    cy.get('#connect-button').click();
    cy.acceptMetamaskAccess({
      allAccounts: false,
      signInSignature: true,
    });
    cy.wait(1000);
    cy.get('#not-found-message').first().should('have.text', 'No orders found');
  });
});
