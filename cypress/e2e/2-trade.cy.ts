/// <reference types="cypress" />

describe('Trade page', () => {
  beforeEach(() => {
    cy.intercept(
      `${Cypress.env(
        'CYPRESS_DELIGHT_API_URL'
      )}/view-blockchains/balance-token?chainId=*&address=*&tokenAddress=*`
    ).as('GetFromTokenBalance');

    cy.visit('http://localhost:3000/buy/trade');
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

  it('shows Goerli Testnet chain and ETH token in the deposit button when selected', () => {
    cy.get('#deposit-button').click();
    cy.get('.PageCardHeader__typography')
      .first()
      .should('have.text', 'Select chain and token');
    cy.get('.ChainsList__card').should('have.length', 1);
    cy.get('.ChainsList__card').click();
    cy.get('.TokensList__item').should('have.length', 1);
    cy.get('.TokensList__item img').should('have.attr', 'alt', 'ETH');
    cy.get('.TokensList__item').click();
    cy.get('#deposit-button .MuiCardHeader-title').should('have.text', 'ETH');
    cy.get('#deposit-button .MuiCardHeader-subheader').should(
      'have.text',
      'on Goerli Testnet'
    );
  });

  it('shows BSC Testnet chain and BNB token in the receive button when selected', () => {
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

  it('shows error if amount is empty', () => {
    cy.get('button').contains('Search offers').click();
    cy.get('.Mui-error')
      .contains('Amount is required')
      .should('have.length', 1);
  });

  it('shows offers if form is submitted', () => {
    cy.wait(['@GetFromTokenBalance']);
    cy.get('button').contains('max').click();
    cy.get('button').contains('Search offers').click();
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get('.OfferPublic__card').click();
    cy.get('.PageCardHeader__typography')
      .first()
      .should('have.text', 'Review offer');
  });

  it('shows review offer page when execution time icon is selected', () => {
    cy.wait(['@GetFromTokenBalance']);
    cy.get('button').contains('max').click();
    cy.get('button').contains('Search offers').click();
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get('#execution-time-icon').click();
    cy.get('.PageCardHeader__typography')
      .first()
      .should('have.text', 'Review offer');
  });

  it('shows review offer page when estimated network fee icon is selected', () => {
    cy.wait(['@GetFromTokenBalance']);
    cy.get('button').contains('max').click();
    cy.get('button').contains('Search offers').click();
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get('#estimated-network-fee-icon').click();
    cy.get('.PageCardHeader__typography')
      .first()
      .should('have.text', 'Review offer');
  });

  it('shows review offer page when chains icon is selected', () => {
    cy.wait(['@GetFromTokenBalance']);
    cy.get('button').contains('max').click();
    cy.get('button').contains('Search offers').click();
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get('#chains-icon').click();
    cy.get('.PageCardHeader__typography')
      .first()
      .should('have.text', 'Review offer');
  });

  it('returns to offers list', () => {
    cy.wait(['@GetFromTokenBalance']);
    cy.get('button').contains('max').click();
    cy.get('button').contains('Search offers').click();
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get('#execution-time-icon').click();
    cy.get('.PageCardHeader__typography')
      .first()
      .should('have.text', 'Review offer');
    cy.get('#return').click();
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
  });

  it('places an order', () => {
    cy.wait(['@GetFromTokenBalance']);
    cy.get('input[name="amount"]').type('0.001');
    cy.get('button').contains('Search offers').click();
    cy.get('.TradePage__box').should('have.css', 'opacity', '1');
    cy.get('.OfferPublic__card').click();
    cy.get('.PageCardHeader__typography')
      .first()
      .should('have.text', 'Review offer');
    cy.contains('button', 'Place Order').click();
    cy.wait(2000);
    cy.confirmMetamaskTransaction();
    cy.wait(2000);
    cy.contains('button', 'Close').click();
  });
});
