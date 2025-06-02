const loginWith = async (page, username, password)  => {
    await page.getByRole('textbox').first().fill(username)
    await page.getByRole('textbox').last().fill(password)
    await page.getByTestId('loginButton').click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByTestId('newBlog').click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByTestId('createButton').click()
}

async function createSecondUser(request) {
  await request.post('http://localhost:3003/api/users', {
    data: {
      name: 'Second User',
      username: 'user2',
      password: 'password'
    }
  })
}

export { loginWith, createBlog, createSecondUser}