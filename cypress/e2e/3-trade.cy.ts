/// <reference types="cypress" />

describe('Trade page', () => {
  beforeEach(() => {
    cy.intercept(
      `${Cypress.env(
        'CYPRESS_DELIGHT_API_URL'
      )}/view-blockchains/balance-token?chainId=*&address=*&tokenAddress=*`
    ).as('GetFromTokenBalance');

    cy.intercept('POST', `${Cypress.env('CYPRESS_DELIGHT_API_URL')}/orders`).as(
      'PlaceOrder'
    );

    cy.visit('http://localhost:3000/buy/trade?popup=false');
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

  it('Shows BSC Testnet chain and BNB token in the receive button', () => {
    cy.get('#receive-button').click();
    cy.get('.PageCardHeader__typography')
      .first()
      .should('have.text', 'Select chain and token');
    cy.get('.ChainsList__card').should('have.length', 1);
    cy.get('.ChainsList__card').click();
    cy.get('.TokensList__item').should('have.length', 1);
    cy.get('.TokensList__item img').should('have.attr', 'alt', 'BNB');
    cy.get('.TokensList__item').click();
    cy.get('#receive-button .MuiCardHeader-title').should('have.text', 'BNB');
    cy.get('#receive-button .MuiCardHeader-subheader').should(
      'have.text',
      'on BSC Testnet'
    );
  });

  it('Shows error if amount is empty', () => {
    cy.get('button').contains('Search offers').click();
    cy.get('.Mui-error')
      .contains('Amount is required')
      .should('have.length', 1);
  });

  it('Shows offers if form is submitted', () => {
    cy.wait(['@GetFromTokenBalance']);
    cy.get('button').contains('max').click();
    cy.get('button').contains('Search offers').click();
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get('.OfferPublic').first().click();
    cy.get('.PageCardHeader__typography')
      .first()
      .should('have.text', 'Review offer');
  });

  it('Shows review offer page when offer is selected', () => {
    cy.wait(['@GetFromTokenBalance']);
    cy.get('button').contains('max').click();
    cy.get('button').contains('Search offers').click();
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get('.OfferPublic').first().click();
    cy.get('.PageCardHeader__typography')
      .first()
      .should('have.text', 'Review offer');
  });

  it('Returns to offers list on back button click', () => {
    cy.wait(['@GetFromTokenBalance']);
    cy.get('button').contains('max').click();
    cy.get('button').contains('Search offers').click();
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get('.OfferPublic').first().click();
    cy.get('.PageCardHeader__typography')
      .first()
      .should('have.text', 'Review offer');
    cy.get('#return').click();
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
  });

  it('Places an order', () => {
    cy.wait(['@GetFromTokenBalance']);
    cy.get('input[name="amount"]').type('0.001');
    cy.get('button').contains('Search offers').click();
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get(
      '.OfferPublic[data-provider="0x8730762Cad4a27816A467fAc54e3dd1E2e9617A1"]'
    )
      .first()
      .click();
    cy.get('.PageCardHeader__typography')
      .first()
      .should('have.text', 'Review offer');
    cy.contains('button', 'Place Order').click();
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
