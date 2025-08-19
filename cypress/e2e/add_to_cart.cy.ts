describe('catalog flow', () => {
  it('adds first product to cart and checks out', () => {
    cy.visit('/')
    cy.get('[data-testid="product-card"]').first().contains('Add').click()
    cy.get('[data-testid="open-cart"]').click()
    cy.get('[data-testid="checkout"]').should('not.be.disabled')
  })
})
