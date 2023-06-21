describe('Blog app', function () {
  beforeEach(function () {
    cy.visit('http://localhost:3000')
  })
  it('front page can be opened', function () {
    cy.contains('Log in to my application')
    cy.contains('login')
  })
  it('login form can be opened', function () {
    cy.contains('log in').click()
  })
  it('user can login', function () {
    cy.contains('log in').click()
    cy.get('#username').type('Test')
    cy.get('#password').type('dNX3sTE3')
    cy.get('#login-button').click()

    cy.contains('Roman logged in')
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.contains('log in').click()
      cy.get('input:first').type('Test')
      cy.get('input:last').type('dNX3sTE3')
      cy.get('#login-button').click()
    })
    it('a new blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('input#title').type('A blog created by Cypress')
      cy.get('input#author').type('John Doe')
      cy.get('input#url').type('https://example.com')
      cy.contains('save').click()
      cy.contains('A blog created by Cypress')
    })
  })
})
