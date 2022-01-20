describe('Test deleting an existing user', function () {
    it('Visits the user login page from home', function () {
        cy.visit('http://localhost:3000/');
        cy.get('[data-cy=login-button]').click()
        cy.url().should('include', '/login');
    })

    it('Attempts to login with test credentials', function () {
        cy.get('[data-cy=username-input]')
            .click()
            .clear()
            .type('CypressTest');
        
        cy.get('[data-cy=password-input]')
            .click()
            .clear()
            .type('cypresstest');
        
        cy.contains('Login')
            .click();
        
        cy.url().should('include', '/');
    })

    it('Navigates to the profile page', function () {
        cy.get('[data-cy=account-badge]').click();
        cy.url().should('include', '/profile');
    })

    it('Deletes the account', function () {
        cy.get('[data-cy=delete-account-button]')
            .click();
        
        // modal confirmation
        cy.get('[data-cy=modal-confirm-button]')
            .click();

        // swap this out for more reliable test 
        cy.url().should('include', '/');
    })

    it('Visits the user login page from home', function () {
        cy.visit('http://localhost:3000/');
        cy.get('[data-cy=login-button]').click()
        cy.url().should('include', '/login');
    })

    it('Attempts to login with deleted credentials', function () {
        cy.get('[data-cy=username-input]')
            .click()
            .clear()
            .type('CypressTest');
        
        cy.get('[data-cy=password-input]')
            .click()
            .clear()
            .type('cypresstest');
        
        cy.contains('Login')
            .click();
        
        cy.contains('Login Failed').should('be.visible');
    })
})