/// <reference types="cypress" />

describe('Faucet page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/faucet');
    cy.get('#connect-button').click();
    cy.confirmMetamaskSignatureRequest();
    cy.wait(1000);
  });

  it('Shows faucet page', () => {
    cy.get('.PageCardHeader__typography').first().should('have.text', 'Faucet');
  });
});
