const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Esa Taberman',
        username: 'etab',
        password: 'password'
      }
    })

    await helper.createSecondUser(request)

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('login to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await helper.loginWith(page, 'etab', 'password')

      await expect(page.getByText('Esa Taberman has logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await helper.loginWith(page, 'etab', 'password')

      await expect(page.getByText('login to application')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await helper.loginWith(page, 'etab', 'password')
    })

    test('a new blog can be created', async ({ page }) => {
      await helper.createBlog(page, 'Epic Blog', 'Blog Person', 'https://blogs.com/epic')

      await expect(page.getByTestId('blogList')).toContainText('Epic Blog')
    })

    test('a blow can be liked', async ({ page }) => {
      await helper.createBlog(page, 'Epic Blog', 'Blog Person', 'https://blogs.com/epic')
      await page.getByRole('button', { name: 'view' }).click()

      await expect(page.getByText('https://blogs.com/epic')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes: 1')).toBeVisible()
    })

    test('a blog can be deleted by the right user', async ({ page }) => {
      await helper.createBlog(page, 'Epic Blog', 'Blog Person', 'https://blogs.com/epic')
      await page.getByRole('button', { name: 'view' }).click()

      page.once('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'delete' }).click()



      await expect(page.getByTestId('blogList')).not.toContainText('Epic Blog')
    })

    test('a user cannot see delete button on blogs made by others', async ({ page }) => {
      await helper.createBlog(page, 'Epic Blog', 'Blog Person', 'https://blogs.com/epic')
      await page.getByRole('button', { name: 'logout' }).click()
      await expect(page.getByText('login to application')).toBeVisible()
      await helper.loginWith(page, 'user2', 'password')
      await expect(page.getByText('Second User has logged in')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'delete' })).toHaveCount(0)

    })
  })

  test('blogs are shown in the right order depending on the amount of likes', async ({ page }) => {
      await helper.loginWith(page, 'etab', 'password')

      await helper.createBlog(page, 'Epic Blog', 'Blog Person', 'https://blogs.com/epic')
      await page.getByRole('button', { name: 'cancel' }).click()
      await helper.createBlog(page, 'Should be first blog soon', 'Obama', 'https://blogs.com/first')

      await expect(page.getByTestId('blogList')).toContainText('Should be first blog soon')
      await page.getByRole('button', { name: 'view' }).last().click()
      await expect(page.getByText('https://blogs.com/first')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes: 1')).toBeVisible()
      await page.getByRole('button', { name: 'hide' }).click()

      const blogListText = await page.getByTestId('blogList').innerText()
      const firstIndex = blogListText.indexOf('Should be first blog soon')
      const secondIndex = blogListText.indexOf('Epic Blog')
      expect(firstIndex).toBeLessThan(secondIndex)
    })
})
