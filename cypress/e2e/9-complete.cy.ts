/// <reference types="cypress" />

describe('Complete testing', () => {
  beforeEach(() => {
    cy.intercept(`${Cypress.env('CYPRESS_DELIGHT_API_URL')}/offers/user*`).as(
      'GetUserOffers'
    );
    cy.intercept(
      'PUT',
      `${Cypress.env('CYPRESS_DELIGHT_API_URL')}/offers/*`
    ).as('UpdateOffer');

    cy.visit('http://localhost:3000/sell/offers');

    cy.get('#connect-button').click();
    cy.confirmMetamaskSignatureRequest();
    cy.wait(1000);
  });

  it('Deactivates active offer', () => {
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

          cy.allowMetamaskToSwitchNetwork();
          cy.confirmMetamaskTransaction();
        });
    });
  });
});
