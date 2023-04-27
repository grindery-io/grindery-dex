/// <reference types="cypress" />

describe('Faucet page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/faucet');
    cy.get('#connect-button').click();
    cy.confirmMetamaskSignatureRequest();
    cy.wait(1000);
  });

  it('Shows faucet page sidebar', () => {
    cy.get('#faucet-list-subheader').first().should('have.text', 'Faucet');
    cy.get('#faucet-list').first().should('have.text', 'Goerli ETH Tokens');
    cy.get('#faucet-list').click();
  });

  it('Shows link to Goerli faucet', () => {
    cy.get('.PageCardHeader__typography').first().should('have.text', 'Faucet');
    cy.get('.Faucet_text')
      .first()
      .should(
        'have.text',
        'Visit goerlifaucet.comto get some Goerli-ETH tokens.'
      );
    cy.get('#faucet-link').click();
  });
});
