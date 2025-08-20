describe('Shopping Cart', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should start with an empty cart', () => {
    // Check initial cart state
    cy.get('[data-testid="open-cart"]').should('contain', '0')
  })

  it('should add a product to cart', () => {
    // Wait for products to load
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).should('exist')
    
    // Add first product to cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('button').contains('Add').click()
    })
    
    // Check if cart count increased
    cy.get('[data-testid="open-cart"]').should('contain', '1')
  })

  it('should open cart drawer when cart button is clicked', () => {
    // Add a product first
    // cy.log('asdassasdsas => ', cy.get('[data-testid="product-card"]', { timeout: 10000 }).first())
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).first().within(() => {
      cy.get('button').contains('Add').click()
    })
    
    // Open cart drawer
    cy.get('[data-testid="open-cart"]').click()
    
    // Check if cart drawer is visible
    cy.get('[data-testid="cart-drawer"], .cart-drawer', { timeout: 10000 }).should('be.visible')
  })

  it('should display added products in cart drawer', () => {
    // Add a product
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).first().within(() => {
      cy.get('button').contains('Add').click()
    })
    
    // Open cart drawer
    cy.get('[data-testid="open-cart"]').click()
    
    // Check if product is in cart - looking for the actual cart item structure
    cy.get('[data-testid="cart-drawer"], .cart-drawer').within(() => {
      cy.get('.cart-item > div').should('have.length', 1) // One cart item div
      cy.get('input[aria-label="increase-quantity"]').should('exist') // Quantity input exists
      cy.get('button').contains('Remove').should('exist') // Remove button exists
    })
  })

  it('should allow quantity adjustment in cart', () => {
    // Add a product
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).first().within(() => {
      cy.get('button').contains('Add').click()
    })
    
    // Open cart drawer
    cy.get('[data-testid="open-cart"]').click()
    
    // Increase quantity using the input field
    cy.get('[data-testid="cart-drawer"], .cart-drawer').within(() => {
      cy.get('input[aria-label="increase-quantity"]').clear().type('2')
      
      // Wait a moment for the change to be processed
      cy.wait(500)
    })
    
    // Check if cart count increased
    cy.get('[data-testid="open-cart"]').should('contain', '2')
  })

  it('should remove product from cart', () => {
    // Add a product
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).first().within(() => {
      cy.get('button').contains('Add').click()
    })
    
    // Open cart drawer
    cy.get('[data-testid="open-cart"]').click()
    
    // Remove product
    cy.get('[data-testid="cart-drawer"], .cart-drawer').within(() => {
      cy.get('button').contains('Remove').click()
    })
    
    // Check if cart is empty
    cy.get('[data-testid="open-cart"]').should('contain', '0')
  })

  it('should calculate total price correctly', () => {
    // Add a product
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).first().within(() => {
      cy.get('button').contains('Add').click()
    })
    
    // Open cart drawer
    cy.get('[data-testid="open-cart"]').click()
    
    // Check if total is displayed
    cy.get('[data-testid="cart-drawer"], .cart-drawer').within(() => {
      cy.get('[data-testid="cart-total"], .total').should('contain', '$')
    })
  })

  it('should close cart drawer when close button is clicked', () => {
    // Add a product
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).first().within(() => {
      cy.get('button').contains('Add').click()
    })
    
    // Open cart drawer
    cy.get('[data-testid="open-cart"]').click()
    
    // Close cart drawer
    cy.get('[data-testid="close-cart"]').click()
    
    // Check if cart drawer is hidden (checking for invisible class)
    cy.get('[data-testid="cart-drawer"]').should('have.class', 'invisible')
  })

  it('should persist cart items between page refreshes', () => {
    // Add a product
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).first().within(() => {
      cy.get('button').contains('Add').click()
    })
    
    // Check cart count
    cy.get('[data-testid="open-cart"]').should('contain', '1')
    
    // Refresh page
    cy.reload()
    
    // Check if cart count persists
    cy.get('[data-testid="open-cart"]').should('contain', '1')
  })

  it('should add multiple different products to cart', () => {
    // Add first product
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).first().within(() => {
      cy.get('button').contains('Add').click()
    })
    
    // Add second product if it exists
    cy.get('[data-testid="product-card"]').then(($cards) => {
      if ($cards.length > 1) {
        cy.wrap($cards).eq(1).within(() => {
          cy.get('button').contains('Add').click()
        })
        
        // Check cart count
        cy.get('[data-testid="open-cart"]').should('contain', '2')
      }
    })
  })
})
