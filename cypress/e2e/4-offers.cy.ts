/// <reference types="cypress" />

/*
Offers test implementation
[ ] It shows coming soon page if user is not an admin
[X] It shows offers page if user is an admin
[X] It shows offers list
[X] It shows create an offer form on create offer button click
[X] It shows BNB as sell option in create offer form
[X] It shows ETH as receive option in create offer form
[X] It selects sell option in create offer form
[X] It select receive option in create offer form
[X] It shows error if any of required fields is empty
[_] It creates an offer on create offer form submission
[ ] It shows offer details when offer selected
[ ] It deactivates an offer on deactivate button click
[ ] It activates an offer on activate button click
*/

describe('Trade page', () => {
  beforeEach(() => {
    cy.intercept('https://delight-api.grindery.org/offers/user').as(
      'GetUserOffers'
    );
    cy.intercept('https://delight-api.grindery.org/offers/id?id=*').as(
      'GetCreatedOffer'
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

  it('It shows offers page if user is an admin', () => {
    cy.get('.page-card-title').should('have.text', 'Offers');
  });

  it('It shows offers list', () => {
    cy.wait('@GetUserOffers').then(() => {
      cy.wait(1000);
      cy.get('.offers-list').should('exist');
    });
  });

  it('It shows create an offer form on create offer button click', () => {
    cy.get('button').contains('Create offer').click();
    cy.get('.page-card-title').should('have.text', 'Create offer');
  });

  it('It shows BNB as sell option in create offer form', () => {
    cy.get('button').contains('Create offer').click();
    cy.get('#sell-button .MuiCardHeader-title').should('have.text', 'BNB');
    cy.get('#sell-button .MuiCardHeader-subheader').should(
      'have.text',
      'on BSC Testnet'
    );
  });

  it('It shows ETH as receive option in create offer form', () => {
    cy.get('button').contains('Create offer').click();
    cy.get('#receive-button .MuiCardHeader-title').should('have.text', 'ETH');
    cy.get('#receive-button .MuiCardHeader-subheader').should(
      'have.text',
      'on Goerli Testnet'
    );
  });

  it('It selects sell option in create offer form', () => {
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

  it('It select receive option in create offer form', () => {
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

  it('It shows error if any of required fields is empty', () => {
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

  it('It creates an offer on create offer form submission', () => {
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

        cy.wait('@GetCreatedOffer', { requestTimeout: 120000 }).then(() => {
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
});
