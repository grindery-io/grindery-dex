/// <reference types="cypress" />

describe('Offers page', () => {
  beforeEach(() => {
    cy.intercept('https://delight-api.grindery.org/offers/user').as(
      'GetUserOffers'
    );
    cy.intercept('https://delight-api.grindery.org/offers/id?id=*').as(
      'GetCreatedOffer'
    );
    cy.intercept('PUT', 'https://delight-api.grindery.org/offers/*').as(
      'UpdateOffer'
    );

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

  it('Shows offers page if user is an admin', () => {
    cy.get('.page-card-title').should('have.text', 'Offers');
  });

  it('Shows offers list', () => {
    cy.wait('@GetUserOffers').then(() => {
      cy.wait(1000);
      cy.get('.offers-list').should('exist');
    });
  });

  it('Shows create an offer form on create offer button click', () => {
    cy.get('button').contains('Create offer').click();
    cy.get('.page-card-title').should('have.text', 'Create offer');
  });

  it('Shows BNB as sell option in create offer form', () => {
    cy.get('button').contains('Create offer').click();
    cy.get('#sell-button .MuiCardHeader-title').should('have.text', 'BNB');
    cy.get('#sell-button .MuiCardHeader-subheader').should(
      'have.text',
      'on BSC Testnet'
    );
  });

  it('Shows ETH as receive option in create offer form', () => {
    cy.get('button').contains('Create offer').click();
    cy.get('#receive-button .MuiCardHeader-title').should('have.text', 'ETH');
    cy.get('#receive-button .MuiCardHeader-subheader').should(
      'have.text',
      'on Goerli Testnet'
    );
  });

  it('Selects sell option in create offer form', () => {
    cy.get('button').contains('Create offer').click();
    cy.get('#sell-button').click({ force: true });
    cy.get('.ChainsList__card').first().click();
    let selectedToken = '';
    cy.get('.TokensList__item')
      .first()
      .find('.MuiListItemText-primary span')
      .then(($element) => {
        selectedToken = $element.text();
        console.log('selectedToken', selectedToken);

        cy.get('.TokensList__item').first().click();
        cy.get('#sell-button .MuiCardHeader-title').should(
          'have.text',
          selectedToken
        );
      });
  });

  it('Selects receive option in create offer form', () => {
    cy.get('button').contains('Create offer').click();
    cy.get('#receive-button').click({ force: true });
    cy.get('.ChainsList__card').first().click();
    let selectedToken = '';
    cy.get('.TokensList__item')
      .first()
      .find('.MuiListItemText-primary span')
      .then(($element) => {
        selectedToken = $element.text();
        console.log('selectedToken', selectedToken);

        cy.get('.TokensList__item').first().click();
        cy.get('#receive-button .MuiCardHeader-title').should(
          'have.text',
          selectedToken
        );
      });
  });

  it('Shows error if any of required fields is empty', () => {
    cy.get('button').contains('Create offer').click();

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

    cy.get('input[name="amountMin"]').type('0.1', { force: true });
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

    cy.get('button').contains('Create').click();
    cy.rejectMetamaskTransaction();
    cy.wait(1000);
  });

  it('Creates an offer on create offer form submission', () => {
    let offersLength;
    cy.wait('@GetUserOffers').then(() => {
      cy.wait(1000);

      cy.get('.offers-list').then((offersList) => {
        if (offersList.find('.OfferPublic').length) {
          offersLength = offersList.find('.OfferPublic').length;
        } else {
          offersLength = 0;
        }
        cy.get('button').contains('Create offer').click();

        cy.get('input[name="exchangeRate"]').type('1', { force: true });
        cy.get('input[name="amountMin"]').type('0.1', { force: true });
        cy.get('input[name="amountMax"]').type('20', { force: true });
        cy.get('input[name="estimatedTime"]').type('120', { force: true });

        cy.get('button').contains('Create').click();

        cy.confirmMetamaskTransaction();

        cy.wait('@GetCreatedOffer', {
          requestTimeout: 120000,
          responseTimeout: 120000,
        }).then(() => {
          cy.wait(1000);
          let offersLengthAfterNewOfferCreated;
          cy.get('.OfferPublic').then((newElements) => {
            offersLengthAfterNewOfferCreated = newElements.length;
            expect(offersLengthAfterNewOfferCreated).to.equal(offersLength + 1);
            cy.wait(1000);
          });
        });
      });
    });
  });

  it('Shows offer details when offer selected', () => {
    cy.wait('@GetUserOffers').then(() => {
      cy.wait(1000);
      cy.get('.OfferPublic').first().should('exist');
      cy.get('.OfferPublic')
        .first()
        .find('button[aria-label="show more"]')
        .should('exist');
      cy.get('.OfferPublic')
        .first()
        .find('button[aria-label="show more"]')
        .click();
      cy.get('.OfferPublic').first().find('.MuiCollapse-root').should('exist');
      cy.get('.OfferPublic')
        .first()
        .find('.MuiCollapse-root button')
        .should('exist');
      cy.get('.OfferPublic')
        .first()
        .find('.MuiCollapse-root p.MuiTypography-body1')
        .first()
        .should('include.text', 'Provider:');
      cy.get('.OfferPublic')
        .first()
        .find('.MuiCollapse-root p.MuiTypography-body1')
        .last()
        .should('include.text', 'Offer ID:');
    });
  });

  it('Deactivates an offer on deactivate button click', () => {
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

  it('Activates an offer on activate button click', () => {
    cy.wait('@GetUserOffers').then(() => {
      cy.wait(1000);
      let offerId: string;
      cy.get('.OfferPublic')
        .last()
        .then((offer) => {
          offerId = offer.attr('id');
          cy.get('#' + offerId)
            .find('button[aria-label="show more"]')
            .click();
          cy.get('#' + offerId)
            .find('button')
            .contains('Activate')
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
              .contains('Deactivate')
              .should('exist');
          });
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
