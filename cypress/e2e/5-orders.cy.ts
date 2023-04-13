/// <reference types="cypress" />

describe('Orders page', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      'https://delight-api.grindery.org/orders/liquidity-provider'
    ).as('GetUserOrders');
    cy.intercept('PUT', 'https://delight-api.grindery.org/orders/complete').as(
      'UpdateOrder'
    );

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

  it('Pays an order and updates order status', () => {
    cy.wait('@GetUserOrders').then(() => {
      cy.wait(1000);
      cy.get('.orders-list').then((ordersList) => {
        if (ordersList.find('.OrderCard-incomplete').length) {
          let orderCardId: string;
          cy.get('.OrderCard-incomplete')
            .first()
            .then((orderCard) => {
              orderCardId = orderCard.attr('id');
              cy.get('#' + orderCardId)
                .find('.OrderCard__button')
                .click();
              cy.wait(2000);
              cy.allowMetamaskToAddAndSwitchNetwork();
              cy.wait(2000);
              cy.confirmMetamaskTransaction();
              cy.wait('@UpdateOrder', {
                requestTimeout: 120000,
                responseTimeout: 120000,
              }).then(() => {
                cy.wait(1000);
                cy.get('#' + orderCardId)
                  .find('.OrderCard__button')
                  .should('have.text', 'Completed');
              });
            });
        } else {
          cy.get('.orders-list .OrderCard-incomplete').should('exist');
        }
      });
    });
  });

  it('Shows coming soon page if user is not an admin', () => {
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
    cy.get('.page-card-title').should('have.text', 'Coming soon');
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
