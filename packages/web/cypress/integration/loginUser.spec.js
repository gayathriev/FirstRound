describe('Test login as existing user', function () {
    it('Visits the user login page from home', function () {
        cy.visit('http://localhost:3000/');
        cy.get('[data-cy=login-button]').click()
        cy.url().should('include', '/login');
    })

    it('Attempts to login with bad credentials', function () {
        cy.get('[data-cy=username-input]')
            .click()
            .type('notarealuser');
        
        cy.get('[data-cy=password-input]')
            .click()
            .type('notarealpassword');
        
        cy.contains('Login')
            .click();
        
        cy.contains('Login Failed').should('be.visible');
    })

    it('Attempts to login with valid credentials', function () {
        cy.get('[data-cy=username-input]')
            .click()
            .clear()
            .type('Test');
        
        cy.get('[data-cy=password-input]')
            .click()
            .clear()
            .type('Test');
        
        cy.contains('Login')
            .click();
        
        cy.url().should('not.include', '/login');
    })
})