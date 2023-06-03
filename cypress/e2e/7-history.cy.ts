/// <reference types="cypress" />

describe('Orders history page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/history');
    cy.get('#connect-button').click();
    cy.confirmMetamaskSignatureRequest();
    cy.wait(1000);
  });

  it('Shows orders list', () => {
    cy.get('.OrderHistoryRow').should('exist');
  });
});
