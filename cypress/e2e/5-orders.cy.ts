/// <reference types="cypress" />

/*
Order page tests implementation progress
[X] Shows orders page if user is an admin
[X] Shows orders list
[ ] Sends an order
[ ] Updates the order status after sending
[ ] Shows coming soon page if user is not an admin
*/

describe('Orders page', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      'https://delight-api.grindery.org/orders/liquidity-provider'
    ).as('GetUserOrders');

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

  it('Shows orders page if user is an admin', () => {
    cy.get('.page-card-title').should('have.text', 'Orders');
  });

  it('Shows orders list', () => {
    cy.wait('@GetUserOrders').then(() => {
      cy.wait(1000);
      cy.get('.orders-list').should('exist');

      cy.get('.orders-list').then((ordersList) => {
        if (ordersList.find('.OrderCard').length) {
          cy.get('.orders-list .OrderCard').first().should('exist');
        } else {
          cy.get('#not-found-message').should('have.text', 'No orders found');
        }
      });
    });
  });
});
