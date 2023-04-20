/// <reference types="cypress" />

describe('Shop page', () => {
  beforeEach(() => {
    cy.intercept('POST', `${Cypress.env('CYPRESS_DELIGHT_API_URL')}/orders`).as(
      'PlaceOrder'
    );

    cy.visit('http://localhost:3000/buy/shop?popup=false');
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

  it('Shows shop offers', () => {
    cy.get('.ShopPageRoot__box').should('exist');
    cy.get('.OfferCard').first().should('exist');
  });

  it('Buys a shop offer', () => {
    cy.get(
      '.OfferCard[data-provider="0x8730762Cad4a27816A467fAc54e3dd1E2e9617A1"]'
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
    }).then(() => {
      cy.contains('button', 'Close').click();
    });
  });
});
