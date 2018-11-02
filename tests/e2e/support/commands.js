// Create custom Cypress commands and overwrite existing ones.
// https://on.cypress.io/custom-commands

Cypress.Commands.add('componentsAreRenderedCorrectly', () => {
  cy.contains('div', 'HelloA')
    .should('have.css', 'color')
    .and('equal', 'rgb(255, 165, 0)')

  cy.contains('div', 'HelloB')
    .should('have.css', 'color')
    .and('equal', 'rgb(0, 128, 0)')
})
