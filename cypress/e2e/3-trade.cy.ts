/// <reference types="cypress" />

describe('Trade page', () => {
  beforeEach(() => {
    cy.intercept(
      `${Cypress.env(
        'CYPRESS_DELIGHT_API_URL'
      )}/view-blockchains/balance-token?chainId=*&address=*&tokenAddress=*`
    ).as('GetFromTokenBalance');

    cy.intercept(
      'POST',
      `${Cypress.env('CYPRESS_DELIGHT_API_URL')}/orders*`
    ).as('PlaceOrder');

    cy.visit('http://localhost:3000/buy/trade');
    cy.get('#connect-button').click();
    cy.confirmMetamaskSignatureRequest();
    cy.wait(1000);
  });

  it('Shows BSC Testnet chain and BNB token in the receive button', () => {
    cy.get('#receive-button').click();
    cy.get('.PageCardHeader__typography')
      .first()
      .should('have.text', 'Receive');
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
    cy.get('#pay-button').click();
    cy.get('.ChainsList__card').first().click();
    cy.get('.TokensList__item').first().click();

    cy.get('#receive-button').click();
    cy.get('.ChainsList__card').first().click();
    cy.get('.TokensList__item').first().click();

    cy.get('input[name="amount"]').type('0.01');
    cy.get('button').contains('Search offers').click();
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get('.TradeOffer').first().should('exist');
  });

  it('Places an order', () => {
    cy.get('input[name="amount"]').type('0.01');
    cy.get('button').contains('Search offers').click();
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get(
      '.TradeOffer[data-provider="0xc8F2da4F38804224fF56E2c28604327Ffbeb2e69"]'
    )
      .first()
      .click();
    cy.get(
      '.TradeOffer[data-provider="0xc8F2da4F38804224fF56E2c28604327Ffbeb2e69"]'
    )
      .first()
      .find('button')
      .contains('Place order')
      .click();
    cy.wait(2000);
    cy.confirmMetamaskTransaction();
    cy.wait('@PlaceOrder', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });
  });
});
