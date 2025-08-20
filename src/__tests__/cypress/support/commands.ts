// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    // Add custom command declarations here
    // Example: login(email: string, password: string): Chainable<void>
  }
}

// Custom commands can be added here
// Cypress.Commands.add('login', (email, password) => { ... })
