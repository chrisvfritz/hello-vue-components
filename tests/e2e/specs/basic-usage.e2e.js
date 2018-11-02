describe('Basic usage', () => {
  it('lib script tag in the browser', () => {
    cy.visit('/browser/lib.html')
    cy.componentsAreRenderedCorrectly()
  })

  it('component script tags in the browser', () => {
    cy.visit('/browser/components.html')
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

  it('lib src in a module system', () => {
    cy.visit('/', {
      onBeforeLoad(contentWindow) {
        contentWindow.__e2e_src_lib = true
      }
    })
    cy.componentsAreRenderedCorrectly()
  })

  it('components src in a module system', () => {
    cy.visit('/', {
      onBeforeLoad(contentWindow) {
        contentWindow.__e2e_src_components = true
      }
    })
    cy.componentsAreRenderedCorrectly()
  })
})
