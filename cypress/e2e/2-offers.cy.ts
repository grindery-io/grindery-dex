/// <reference types="cypress" />

describe('Offers page', () => {
  beforeEach(() => {
    cy.intercept(`${Cypress.env('CYPRESS_DELIGHT_API_URL')}/offers/user*`).as(
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
    cy.confirmMetamaskSignatureRequest();
    cy.wait(1000);
  });

  it('Shows offers page if user is an admin', () => {
    cy.get('.PageCardHeader__typography').should('have.text', 'Offers');
  });

  it('Shows offers list', () => {
    cy.wait('@GetUserOffers').then(() => {
      cy.wait(1000);
      cy.get('.offers-list').should('exist');
    });
  });

  it('Creates offer', () => {
    let offersLength: number;
    cy.wait('@GetUserOffers').then(() => {
      cy.wait(1000);

      cy.get('.offers-list').then((offersList) => {
        if (offersList.find('.OfferPublic').length) {
          offersLength = offersList.find('.OfferPublic').length;
        } else {
          offersLength = 0;
        }
        cy.get('button').contains('Create offer').click();
        cy.get('.PageCardHeader__typography').should(
          'have.text',
          'Create offer'
        );

        cy.get('#sell-button .MuiCardHeader-title').should('have.text', 'BNB');
        cy.get('#sell-button .MuiCardHeader-subheader').should(
          'have.text',
          'on BSC Testnet'
        );

        // v2
        cy.get('#receive-button').click();
        cy.get('.ChainsList__card').first().click();
        cy.get('.TokensList__item').first().click();
        // v2

        cy.get('button').contains('Create').click();

        cy.get('input[name="exchangeRate"]')
          .parents('.MuiFormControl-root')
          .find('.Mui-error')
          .should('exist');

        cy.get('input[name="exchangeRate"]').type('1', { force: true });
        cy.get('input[name="exchangeRate"]')
          .parents('.MuiFormControl-root')
          .find('.Mui-error')
          .should('not.exist');

        cy.get('button').contains('Create').click();

        cy.get('input[name="amountMin"]')
          .parents('.MuiFormControl-root')
          .find('.Mui-error')
          .should('exist');

        cy.get('input[name="amountMin"]').type('0.01', { force: true });
        cy.get('input[name="amountMin"]')
          .parents('.MuiFormControl-root')
          .find('.Mui-error')
          .should('not.exist');

        cy.get('button').contains('Create').click();

        cy.get('input[name="amountMax"]')
          .parents('.MuiFormControl-root')
          .find('.Mui-error')
          .should('exist');

        cy.get('input[name="amountMax"]').type('20', { force: true });
        cy.get('input[name="amountMax"]')
          .parents('.MuiFormControl-root')
          .find('.Mui-error')
          .should('not.exist');

        cy.get('button').contains('Create').click();

        cy.get('input[name="estimatedTime"]')
          .parents('.MuiFormControl-root')
          .find('.Mui-error')
          .should('exist');

        cy.get('input[name="estimatedTime"]').type('120', { force: true });
        cy.get('input[name="estimatedTime"]')
          .parents('.MuiFormControl-root')
          .find('.Mui-error')
          .should('not.exist');

        cy.get('input[name="amount"]').type('0.01', { force: true });

        cy.get('button').contains('Create').click();

        cy.allowMetamaskToAddAndSwitchNetwork();
        cy.confirmMetamaskTransaction();

        cy.wait('@GetCreatedOffer', {
          requestTimeout: 120000,
          responseTimeout: 120000,
        }).then(() => {
          cy.wait(1000);
          let offersLengthAfterNewOfferCreated: number;
          cy.get('.OfferPublic').then((newElements) => {
            offersLengthAfterNewOfferCreated = newElements.length;
            expect(offersLengthAfterNewOfferCreated).to.equal(offersLength + 1);
            cy.wait(1000);
          });
        });
      });
    });
  });
});
