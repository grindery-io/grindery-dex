/// <reference types="cypress" />

describe('Wallet connection', () => {
  beforeEach(() => {
    cy.intercept('https://orchestrator.grindery.org/oauth/session-register').as(
      'RegisterUserSession'
    );
    cy.visit('http://localhost:3000');
  });

  it('displays connect wallet button by default', () => {
    cy.get('#connect-button').should('have.text', 'Connect wallet');
  });

  it('displays disconnect button once connected', () => {
    cy.get('#connect-button').click();

    cy.wait(['@RegisterUserSession']).then((interceptions) => {
      cy.get('#disconnect-button').should('have.text', 'Disconnect');
    });
  });

  it('displays connect wallet button once disconnected', () => {
    cy.get('#connect-button').click();

    cy.wait(['@RegisterUserSession']).then((interceptions) => {
      cy.get('#user-menu-button').click();
      cy.get('#disconnect-button').click();
      cy.wait(1000);
      cy.get('#connect-button').should('have.text', 'Connect wallet');
    });
  });
});
