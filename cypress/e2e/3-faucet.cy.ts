/// <reference types="cypress" />

describe('Faucet page', () => {
  beforeEach(() => {
    cy.intercept(
      'https://delight-api.grindery.org/view-blockchains/balance-token?chainId=*&address=*&tokenAddress=*'
    ).as('GetFromTokenBalance');
    cy.visit('http://localhost:3000/faucet');
    cy.get('#connect-button').click();
    cy.confirmMetamaskSignatureRequest();
    cy.wait(1000);
  });

  it('shows faucet page tabs', () => {
    cy.get('#faucet-list-subheader').first().should('have.text', 'Faucet');
    cy.get('#faucet-list').first().should('have.text', 'Goerli ETH Tokens');
    cy.get('#faucet-list').click();
  });

  it('shows faucet page description', () => {
    cy.get('.page-card-title').first().should('have.text', 'Faucet');
    cy.get('.Faucet_text')
      .first()
      .should(
        'have.text',
        'Visit goerlifaucet.comto get some Goerli-ETH tokens.'
      );
    cy.get('#faucet-link').click();
  });
});
