import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogCreator from './BlogCreator'


test('calls onBlogCreation with correct data', async () => {
    const mockHandler = vi.fn()
    const { container } = render(<BlogCreator onBlogCreation={mockHandler} />)
    const userE = userEvent.setup()

    await userE.click(screen.getByText('new blog'))

    await userE.type(await screen.findByLabelText(/title:/i), 'Blog Title')
    await userE.type(await screen.findByLabelText(/author:/i), 'Author123')
    await userE.type(await screen.findByLabelText(/url:/i), 'www.www.com')

    await userE.click(screen.getByText('create'))

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler).toHaveBeenCalledWith({
        title: 'Blog Title',
        author: 'Author123',
        url: 'www.www.com'
    })
})