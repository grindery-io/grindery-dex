import AlertBox from './AlertBox';

const children = 'This is an alert message.';

describe('AlertBox', () => {
  it('should display the children prop', () => {
    cy.mount(<AlertBox>{children}</AlertBox>);

    cy.contains(children).should('be.visible');
  });

  it('should display the success icon when color prop is set to success', () => {
    cy.mount(<AlertBox color="success">{children}</AlertBox>);

    cy.get('[data-testid="success-icon"]').should('be.visible');
  });

  it('should display the error icon when color prop is set to error', () => {
    cy.mount(<AlertBox color="error">{children}</AlertBox>);

    cy.get('[data-testid="error-icon"').should('be.visible');
  });

  it('should apply custom styles to the wrapper element', () => {
    const wrapperStyle = { backgroundColor: 'red', padding: '10px' };
    cy.mount(<AlertBox wrapperStyle={wrapperStyle}>{children}</AlertBox>);

    cy.get('[data-testid="alert-box-wrapper"]')
      .should('have.css', 'background-color', 'rgb(255, 0, 0)')
      .should('have.css', 'padding', '10px');
  });
});
