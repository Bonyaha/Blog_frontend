import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls event handler with correct details when a new blog is created', () => {
    const mockAddBlog = jest.fn()

    render(<BlogForm addBlog={mockAddBlog} />)

    const titleInput = screen.getByLabelText('Title:')
    const authorInput = screen.getByLabelText('Author:')
    const urlInput = screen.getByLabelText('Url:')
    const saveButton = screen.getByText('save')

    fireEvent.change(titleInput, { target: { value: 'Test Title' } })
    fireEvent.change(authorInput, { target: { value: 'Test Author' } })
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } })

    fireEvent.click(saveButton)

    expect(mockAddBlog).toHaveBeenCalledTimes(1)
    expect(mockAddBlog).toHaveBeenCalledWith({
      title: 'Test Title',
      author: 'Test Author',
      url: 'https://example.com',
      checked: false,
    })
  })
})
