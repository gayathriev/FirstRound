describe('Test registering a user', function () {
    it('Visits the user register page through login page', function () {
        cy.visit('http://localhost:3000/');
        cy.get('[data-cy=login-button]').click()
        cy.url().should('include', '/login');

        cy.get('[data-cy=register-link]').click()
        cy.url().should('include', '/register');
    })

    it('Attempts to register with used username', function () {
        cy.get('[data-cy=username-input]')
            .click()
            .type('Test');

        cy.get('[data-cy=email-input]')
            .click()
            .type('notausedemail@cypress.test');

        cy.get('[data-cy=password-input]')
            .click()
            .type('cypresstest');
        
        cy.contains('Register')
            .click();
        
        cy.contains('Register Failed').should('be.visible');
    })

    it('Attempts to register with used email', function () {
        cy.get('[data-cy=username-input]')
            .click()
            .clear()
            .type('CypressTest');   // will be deleted in pipeline
        
        cy.get('[data-cy=email-input]')
            .click()
            .clear()
            .type('Test');      // taken email

        cy.get('[data-cy=password-input]')
            .click()
            .clear()
            .type('cypresstest');
        
        cy.contains('Register')
            .click();
        
        cy.contains('Register Failed').should('be.visible');
    })

    it('Attempts to register with valid credentials', function () {
        cy.get('[data-cy=username-input]')
            .click()
            .clear()
            .type('CypressTest');
        
        cy.get('[data-cy=email-input]')
            .click()
            .clear()
            .type('email@cypress.test');      //  will be deleted in pipeline
        
        cy.get('[data-cy=password-input]')
            .click()
            .clear()
            .type('cypresstest');
        
        cy.contains('Register')
            .click();
        
        cy.url().should('not.include', '/register');
    })
})