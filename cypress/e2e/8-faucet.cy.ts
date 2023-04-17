/// <reference types="cypress" />

describe('Faucet page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/faucet');
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
