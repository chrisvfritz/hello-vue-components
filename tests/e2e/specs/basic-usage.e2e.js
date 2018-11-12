describe('Basic usage', () => {
  it('lib script tag in the browser', () => {
    cy.visit('/lib.html')
    cy.title().should('eq', 'lib')
    cy.componentsAreRenderedCorrectly()
  })

  it('component script tags in the browser', () => {
    cy.visit('/components.html')
    cy.title().should('eq', 'components')
    cy.componentsAreRenderedCorrectly()
  })

  it('lib dist in a module system', () => {
    cy.visit('/', {
      onBeforeLoad(contentWindow) {
        contentWindow.__e2e_lib = true
      }
    })
    cy.componentsAreRenderedCorrectly()
  })

  it('components dist in a module system', () => {
    cy.visit('/', {
      onBeforeLoad(contentWindow) {
        contentWindow.__e2e_components = true
      }
    })
    cy.componentsAreRenderedCorrectly()
  })

  it('components dist in a module system', () => {
    cy.visit('/', {
      onBeforeLoad(contentWindow) {
        contentWindow.__e2e_components = true
      }
    })
    cy.componentsAreRenderedCorrectly()
  })
})
