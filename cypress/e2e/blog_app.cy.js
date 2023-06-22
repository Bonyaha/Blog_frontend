/* Tests contain two ways of logging and creating new blogs: throug form like user and through API with commands in commands.js file */

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Roman',
      username: 'Test',
      password: 'dNX3sTE3',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to my application')
    cy.contains('login')
  })

  describe('Login', function () {
    it('login form can be opened', function () {
      cy.contains('log in').click()
    })

    it('succeeds with correct credentials', function () {
      cy.contains('log in').click()
      cy.get('#username').type('Test')
      cy.get('#password').type('dNX3sTE3')
      cy.get('#login-button').click()

      cy.contains('Roman logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('log in').click()
      cy.get('#username').type('Test')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').contains('Wrong credentials')
      cy.get('.error')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'Roman logged in')
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'Test', password: 'dNX3sTE3' })
    })
    it('a new blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('input#title').type('A blog created by Cypress')
      cy.get('input#author').type('John Doe')
      cy.get('input#url').type('https://example.com')
      cy.contains('save').click()
      cy.contains('A blog created by Cypress')
    })
    it('it can open view', function () {
      cy.createBlog({
        title: 'Another blog created by Cypress',
        author: 'John Doe',
        url: 'https://example.com',
      })

      cy.contains('view').click()
      cy.contains('Url')
    })
  })
  describe('Liking a blog', () => {
    beforeEach(() => {
      cy.login({ username: 'Test', password: 'dNX3sTE3' })

      cy.createBlog({
        title: 'Test Blog',
        author: 'John Doe',
        url: 'https://example.com',
      })
    })

    it('increments the like count of a blog', () => {
      cy.contains('view').click()

      cy.contains('like').click()

      cy.contains('Likes: 1')
    })
  })

  describe('Deleting a blog', () => {
    beforeEach(() => {
      cy.login({ username: 'Test', password: 'dNX3sTE3' })

      cy.createBlog({
        title: 'Test Blog',
        author: 'John Doe',
        url: 'https://example.com',
      })
    })

    it('allows the user to delete their own blog', () => {
      cy.contains('view').click()

      // Click the "Delete" button
      cy.contains('remove').click()

      // Confirm the deletion
      cy.contains('Confirm Deletion').should('be.visible')
      cy.contains('Delete').click()

      // Verify that the blog is deleted
      cy.contains('Test Blog John Doe').should('not.exist')
    })
  })

  describe('Delete button visibility', () => {
    beforeEach(() => {
      cy.login({ username: 'Test', password: 'dNX3sTE3' })

      // Create a new blog by User A
      cy.createBlog({
        title: 'Test Blog',
        author: 'User A',
        url: 'https://example.com',
        likes: 0,
      })
    })

    it('shows the delete button only for the creator blog', () => {
      // Log out User A
      cy.contains('log out').click()

      const user = {
        name: 'Test',
        username: 'Sachunka',
        password: 'dNX3sTE3',
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
      // Log in as User B
      cy.login({ username: 'Sachunka', password: 'dNX3sTE3' })

      // Find the blog created by User A and click the "View" button
      cy.contains('view').click()

      // Ensure that the delete button is not visible for User B
      cy.contains('remove').should('not.exist')
    })
  })

  describe('Sorting blogs', () => {
    beforeEach(() => {
      cy.login({ username: 'Test', password: 'dNX3sTE3' })

      // Create a new blog by User A
      cy.createBlog({
        title: 'The title with the second most likes',
        author: 'User A',
        url: 'https://example.com',
        likes: 4,
      })
      cy.createBlog({
        title: 'The title with the most likes',
        author: 'User A',
        url: 'https://example.com',
        likes: 8,
      })
      cy.createBlog({
        title: 'Test3',
        author: 'User A',
        url: 'https://example.com',
        likes: 3,
      })
    })

    it('Blogs are ordered by likes in descending order', () => {
      // Click on the "sort⬇" button to sort blogs by likes in descending order
      cy.get('.blog')
        .eq(0)
        .should('contain', 'The title with the second most likes')
      cy.get('.blog').eq(1).should('contain', 'The title with the most likes')

      cy.contains('button', 'sort⬇').click()

      cy.wait(1000)
      cy.get('.blog')
        .eq(0)
        .should('contain', 'The title with the most likes User A')

      cy.get('.blog')
        .eq(1)
        .should('contain', 'The title with the second most likes User A')
    })
  })
})
