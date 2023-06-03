/// <reference types="cypress" />

describe('Shop page', () => {
  beforeEach(() => {
    cy.intercept('POST', `${Cypress.env('CYPRESS_DELIGHT_API_URL')}/orders`).as(
      'PlaceOrder'
    );

    cy.visit('http://localhost:3000/buy/shop');

    cy.get('#connect-button').click();
    cy.confirmMetamaskSignatureRequest();
    cy.wait(1000);
  });

  it('Shows shop offers', () => {
    cy.get('.ShopPageRoot__box').should('exist');
    cy.get('.OfferCard').first().should('exist');
  });

  it('Buys a shop offer', () => {
    cy.get(
      '.OfferCard[data-provider="0xc8F2da4F38804224fF56E2c28604327Ffbeb2e69"]'
    )
      .first()
      .get('.OfferCardAction button')
      .invoke('attr', 'id')
      .then((idValue) => {
        cy.get('#' + idValue).click();
      });
    cy.wait(2000);
    cy.confirmMetamaskTransaction();
    cy.wait('@PlaceOrder', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });
  });
});
