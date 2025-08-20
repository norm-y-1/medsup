# Cypress E2E Tests for MedSup Pro

This directory contains comprehensive end-to-end tests for the MedSup Pro application using Cypress.

## Test Structure

The tests are organized into the following files:

### 📄 Test Files

1. **`catalog.cy.ts`** - Tests for the main catalog page functionality
   - Product loading and display
   - Search functionality
   - Category filtering
   - Sorting options
   - Pagination
   - Responsive design

2. **`cart.cy.ts`** - Tests for shopping cart functionality
   - Adding products to cart
   - Cart drawer interactions
   - Quantity adjustments
   - Item removal
   - Cart persistence
   - Total price calculations

3. **`navigation.cy.ts`** - Tests for navigation and UI elements
   - Header navigation
   - Logo and link interactions
   - External link handling
   - Accessibility attributes
   - Keyboard navigation
   - Responsive header layout

4. **`products.cy.ts`** - Tests for product-related functionality
   - Product card display
   - Image loading states
   - Hover effects
   - Lazy loading
   - Price formatting
   - SKU display
   - Grid layout

5. **`performance.cy.ts`** - Tests for performance and accessibility
   - Page load times
   - Semantic HTML structure
   - ARIA labels and accessibility
   - Keyboard accessibility
   - Network error handling
   - Image optimization
   - XSS protection

6. **`error-handling.cy.ts`** - Tests for edge cases and error scenarios
   - Empty product lists
   - API server errors
   - Slow API responses
   - Malformed responses
   - Browser navigation
   - LocalStorage failures
   - Rapid user actions

## 🚀 Running the Tests

### Prerequisites
Make sure you have the development server running:
```bash
yarn dev
# or
npm run dev
```

### Run Tests in Interactive Mode
```bash
yarn test:cypress:open
# or
npx cypress open
```

### Run Tests in Headless Mode
```bash
yarn test:cypress
# or
npx cypress run
```

### Run Specific Test File
```bash
npx cypress run --spec "src/__tests__/cypress/e2e/catalog.cy.ts"
```

## 📋 Test Configuration

The Cypress configuration is defined in `cypress.config.ts`:

- **Base URL**: `http://localhost:5173` (Vite dev server)
- **Viewport**: 1280x720 (desktop)
- **Video Recording**: Disabled for faster execution
- **Screenshots**: Enabled on test failures
- **Test Pattern**: `src/__tests__/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}`

## 🎯 Test Coverage

The tests cover the following areas:

### Functional Testing
- ✅ Product catalog display and interaction
- ✅ Shopping cart functionality
- ✅ Search and filtering
- ✅ Navigation and routing
- ✅ Responsive design

### Non-Functional Testing
- ✅ Performance and load times
- ✅ Accessibility compliance
- ✅ Error handling and edge cases
- ✅ Cross-browser compatibility
- ✅ Security (XSS prevention)

### User Experience Testing
- ✅ User workflows and journeys
- ✅ Interactive elements
- ✅ Loading states and feedback
- ✅ Mobile responsiveness
- ✅ Keyboard navigation

## 🔧 Test Data and Mocking

The tests use Cypress's `cy.intercept()` to mock API responses for:
- Product listings
- Category data
- Error scenarios
- Network failures
- Slow responses

## 📱 Responsive Testing

Tests are run across multiple viewport sizes:
- **Desktop**: 1920x1080, 1280x720
- **Tablet**: 768x1024
- **Mobile**: 375x667, 320x568

## ♿ Accessibility Testing

The tests include accessibility checks for:
- Semantic HTML structure
- ARIA labels and attributes
- Keyboard navigation
- Focus management
- Alt text for images
- Color contrast (basic checks)

## 🐛 Debugging Tests

### Debug Failed Tests
1. Check screenshots in `cypress/screenshots/`
2. Review test output and error messages
3. Use `cy.debug()` or `cy.pause()` for debugging
4. Run tests in headed mode for visual debugging

### Common Issues
- **Timeouts**: Increase timeout values for slow-loading elements
- **Flaky Tests**: Add proper waits and assertions
- **Element Not Found**: Verify test selectors match the actual DOM

## 📈 Best Practices Followed

1. **Page Object Pattern**: Tests use data-testid attributes for reliable element selection
2. **Wait Strategies**: Proper use of `cy.wait()` and timeout options
3. **Test Isolation**: Each test is independent and can run in any order
4. **Error Handling**: Tests verify both success and failure scenarios
5. **Maintainability**: Clear test descriptions and organized structure

## 🔄 Continuous Integration

These tests are designed to run in CI/CD pipelines. For CI environments:

```bash
# Install dependencies
yarn install

# Start the application
yarn dev &

# Wait for server to be ready
npx wait-on http://localhost:5173

# Run tests
yarn test:cypress

# Stop the application
kill %1
```

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Testing Library with Cypress](https://testing-library.com/docs/cypress-testing-library/intro/)
