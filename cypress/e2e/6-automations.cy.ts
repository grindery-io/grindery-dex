/// <reference types="cypress" />

describe('Automations page', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      `${Cypress.env(
        'CYPRESS_DELIGHT_API_URL'
      )}/view-blockchains/drone-address*`
    ).as('GetBotAddress');

    cy.visit('http://localhost:3000/sell/automations');
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

  it('Shows trading automation details when chain is selected', () => {
    cy.get('.SelectChainButton').click();
    cy.get('.ChainsList__card').first().click();
    cy.wait(2000);
    cy.allowMetamaskToSwitchNetwork();
    cy.wait(2000);
    cy.get('textarea[name="liquidityWalletABI"]').should('exist');
    cy.get('textarea[name="poolAbi"]').should('exist');
    cy.changeMetamaskNetwork('goerli');
    cy.wait(2000);
  });

  it('Fetches bot address suggestion from api', () => {
    cy.get('.SelectChainButton').click();
    cy.get('.ChainsList__card').first().click();
    cy.allowMetamaskToSwitchNetwork();
    cy.wait(2000);
    cy.wait('@GetBotAddress');
    cy.get('input[name="bot"]').should(
      'have.value',
      '0x1fED08286FE1E13686e3E4497EfDC847CfE85E76'
    );
    cy.changeMetamaskNetwork('goerli');
    cy.wait(2000);
  });

  it('Shows if power was already delegated', () => {
    cy.get('.SelectChainButton').click();
    cy.get('.ChainsList__card').first().click();
    cy.allowMetamaskToSwitchNetwork();
    cy.wait(2000);
    cy.wait('@GetBotAddress');
    cy.wait(1000);
    cy.get('.MuiAlert-message h6.MuiTypography-root').should(
      'have.text',
      'Power has been delegated to the bot'
    );
    cy.changeMetamaskNetwork('goerli');
    cy.wait(2000);
  });

  it('Delegates power and updates success message', () => {
    cy.get('.SelectChainButton').click();
    cy.get('.ChainsList__card').first().click();
    cy.allowMetamaskToSwitchNetwork();
    cy.wait(2000);
    cy.wait('@GetBotAddress');
    cy.get('button').contains('Delegate power').click();
    cy.wait(1000);
    cy.confirmMetamaskTransaction();
    cy.get('.MuiAlert-message > .MuiStack-root span.MuiTypography-root').should(
      'have.text',
      '0x1fED0828...47CfE85E76'
    );
    cy.changeMetamaskNetwork('goerli');
    cy.wait(2000);
  });

  it('Shows coming soon page if user is not an admin', () => {
    cy.get('#user-menu-button').click();
    cy.get('#disconnect-button').click();
    cy.disconnectMetamaskWalletFromAllDapps();
    cy.resetMetamaskAccount();
    cy.wait(1000);
    cy.switchMetamaskAccount(2);
    cy.get('#connect-button').click();
    cy.acceptMetamaskAccess({
      allAccounts: false,
      signInSignature: true,
    });
    cy.wait(1000);
    cy.get('.PageCardHeader__typography').should('have.text', 'Coming soon');
    cy.get('#user-menu-button').click();
    cy.get('#disconnect-button').click();
    cy.disconnectMetamaskWalletFromAllDapps();
    cy.switchMetamaskAccount(1);
    cy.get('#connect-button').click();
    cy.acceptMetamaskAccess({
      allAccounts: false,
      signInSignature: true,
    });
    cy.wait(1000);
  });
});
