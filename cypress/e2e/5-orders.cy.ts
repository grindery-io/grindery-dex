/// <reference types="cypress" />

describe('Orders page', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      `${Cypress.env('CYPRESS_DELIGHT_API_URL')}/orders/liquidity-provider*`
    ).as('GetUserOrders');
    cy.intercept(
      'PUT',
      `${Cypress.env('CYPRESS_DELIGHT_API_URL')}/orders/complete`
    ).as('UpdateOrder');

    cy.visit('http://localhost:3000/sell/orders');

    cy.get('#connect-button').click();
    cy.confirmMetamaskSignatureRequest();
    cy.wait(1000);
  });

  it('Shows orders page if user is an admin', () => {
    cy.get('.PageCardHeader__typography').should('have.text', 'Orders');
  });

  it('Shows orders list', () => {
    cy.wait('@GetUserOrders').then(() => {
      cy.wait(1000);
      cy.get('#orders-list').should('exist');

      cy.get('#orders-list').then((ordersList) => {
        if (ordersList.find('.OrderCard').length) {
          cy.get('#orders-list .OrderCard').first().should('exist');
        } else {
          cy.get('#not-found-message').should('have.text', 'No orders found');
        }
      });
    });
  });

  it('Pays an order and updates order status', () => {
    cy.wait('@GetUserOrders').then(() => {
      cy.wait(1000);
      cy.get('#orders-list').then((ordersList) => {
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
                  .should('have.text', 'Processing');
                cy.changeMetamaskNetwork('goerli');
                cy.wait(2000);
              });
            });
        } else {
          cy.get('#orders-list .OrderCard-incomplete').should('exist');
        }
      });
    });
  });
});
