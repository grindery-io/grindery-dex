/// <reference types="cypress" />

describe('Complete testing', () => {
  beforeEach(() => {
    cy.intercept(`${Cypress.env('CYPRESS_DELIGHT_API_URL')}/offers/user`).as(
      'GetUserOffers'
    );
    cy.intercept(`${Cypress.env('CYPRESS_DELIGHT_API_URL')}/offers/id?id=*`).as(
      'GetCreatedOffer'
    );
    cy.intercept(
      'PUT',
      `${Cypress.env('CYPRESS_DELIGHT_API_URL')}/offers/*`
    ).as('UpdateOffer');

    cy.visit('http://localhost:3000/sell/offers');
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

  it('Deactivate active offer', () => {
    cy.wait('@GetUserOffers').then(() => {
      cy.wait(1000);
      let offerId: string;
      cy.get('.OfferPublic')
        .first()
        .then((offer) => {
          offerId = offer.attr('id');
          cy.get('#' + offerId)
            .find('button[aria-label="show more"]')
            .click();
          cy.get('#' + offerId)
            .find('button')
            .contains('Deactivate')
            .click();

          cy.confirmMetamaskTransaction();

          cy.wait('@UpdateOffer', {
            requestTimeout: 120000,
            responseTimeout: 120000,
          }).then(() => {
            cy.wait(1000);
            cy.get('#' + offerId)
              .find('button[aria-label="show more"]')
              .click();
            cy.get('#' + offerId)
              .find('button')
              .contains('Activate')
              .should('exist');
          });
        });
    });
  });
});
