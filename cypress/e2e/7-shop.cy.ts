/// <reference types="cypress" />

describe('Shop page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/buy/shop');
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
    cy.get('.OfferCard__box').first().should('exist');
  });

  it('buys a shop offer', () => {
    cy.get('.OfferCard__box')
      .first()
      .get('.OfferCardAction__box button')
      .invoke('attr', 'id')
      .then((idValue) => {
        cy.get('#' + idValue).click();
      });
    cy.wait(2000);
    cy.confirmMetamaskTransaction();
    cy.wait(2000);
    cy.contains('button', 'Close').click();
  });
});
