import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const App = () => {
  const queryClient = useQueryClient()

  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: (blogObject) => {
      queryClient.invalidateQueries('blogs')

      setSuccessMessage(
        `A new blog by ${blogObject.author} is added!`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)


    },
    onError: (error) => {
      console.log(error)
      if (error.response.data.error === 'token expired') {
        setErrorMessage('Session expired. Please log in again.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
      }
    }

  })


  const deleteBlogMutation = useMutation(blogService.delBLogs, {
    onMutate: (variables) => {
      const [id] = variables
      console.log(id)
      return variables
    },
    onSuccess: (_, [id]) => {
      console.log(id)
      const blog = blogs.find((b) => b.id === id)
      queryClient.invalidateQueries('blogs')
      setSuccessMessage(
        `Blog by ${blog.author} was deleted!`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    },
    onError: (error) => {
      console.log(error)
      if (error.response.data.error === 'token expired') {
        setErrorMessage('Session expired. Please log in again.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
      }
    }

  })

  const deleteManyBlogsMutation = useMutation(blogService.delBLogs, {
    onMutate: (variables) => {
      return variables
    },
    onSuccess: (_, [id]) => {
      console.log(id)
      let blogsToDelete = blogs.filter((n) => n.checked === true)
      queryClient.invalidateQueries('blogs')
      setSuccessMessage(`Deleted ${blogsToDelete.length} ${'blogs'}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)


    },
    onError: (error) => {
      console.log(error)
      if (error.response.data.error === 'token expired') {
        setErrorMessage('Session expired. Please log in again.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
      }
    }
  })


  const handleCheckMutation = useMutation(blogService.update, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
    onError: () => {
      setErrorMessage('Blog was already removed from the server')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  })

  const addLikeMutation = useMutation(blogService.update, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
    onError: (_, changedBlog) => {
      setErrorMessage(`Blog '${changedBlog.title}' was already removed from server`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  })



  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      setUser(user)
      blogService.setToken(user.token)

      const tokenExpirationTime = new Date(user.expirationTime)

      if (tokenExpirationTime < new Date()) {
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
        setErrorMessage('Session expired. Please log in again.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }, [])
  const blogFormRef = useRef(null)

  const result = useQuery('blogs', () => blogService.getAll().then(initialBlogs => initialBlogs))


  //console.log(result.data)

  if (result.isLoading) { return <div>loading data...</div> }

  let blogs = result.data


  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)

      setSuccessMessage(`Hello ${user.name}👋`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logOut = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = (blogObject) => {

    blogFormRef.current.toggleVisibility()

    newBlogMutation.mutate(blogObject)

  }

  const addLike = (id) => {
    const blog = blogs.find((b) => b.id === id)

    const changedBlog = { ...blog, likes: ++blog.likes }
    console.log('changedBlog is ', changedBlog)

    addLikeMutation.mutate({ id, changedBlog })
  }

  const sortedBlogsHandler = (sortBy, sortOrder) => {
    //we need to create a new array before sorting it, that's why we use spread on blogs
    const sorted = [...blogs].sort((a, b) => {
      const sortValueA = a[sortBy]
      const sortValueB = b[sortBy]

      if (sortOrder === 'desc') {
        return sortValueB - sortValueA
      } else {
        return sortValueA - sortValueB
      }
    })
    console.log('sorted blogs are ', sorted)
    queryClient.setQueryData('blogs', sorted)

  }

  const delBlogs = () => {

    if (window.confirm('Delete these blogs?')) {
      let blogsToDelete = blogs.filter((n) => n.checked === true)
      console.log('blogsToDelete are', blogsToDelete)
      const blogIds = blogsToDelete.map((b) => b.id)
      deleteManyBlogsMutation.mutate(blogIds)
    }
    return
  }

  const delOneBlog = (id) => {
    deleteBlogMutation.mutate([id])

  }

  const handleCheck = (id) => {
    const blog = blogs.find((b) => b.id === id)
    console.log('blog to modify', blog)
    const changedBlog = { ...blog, checked: !blog.checked }
    console.log('changedBlog is', changedBlog)
    handleCheckMutation.mutate({ id, changedBlog })

    console.log('blogs are after updating:', blogs)

  }

  const showDeleteMany = blogs.filter(
    (b) => b.checked === true && b.user.name === user.name
  )


  return (
    <div>
      <Notification message={errorMessage} isError={true} />
      <Notification message={successMessage} />
      {!user && (
        <>
          <h2>Log in to my application</h2>
          <Togglable buttonLabel='log in'>
            <LoginForm handleLogin={handleLogin} />
          </Togglable>
        </>
      )}
      {user && (
        <div>
          <h2>Blogs</h2>
          {user.name} logged in
          <button
            type='submit'
            style={{ marginLeft: '5px', marginBottom: '15px' }}
            onClick={logOut}
          >
            log out
          </button>
          <button type='button' onClick={() => sortedBlogsHandler('likes', 'desc')}>
            sort⬇
          </button>
          <button type='button' onClick={() => sortedBlogsHandler('likes', 'asc')}>
            sort⬆
          </button>
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>
          {showDeleteMany.length > 1 ? (
            <button className='btn btn-info ms-2' onClick={() => delBlogs()}>
              Delete selected
            </button>
          ) : (
            ''
          )}
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              addLike={() => addLike(blog.id)}
              delOneBlog={() => delOneBlog(blog.id)}
              user={user}
              handleCheck={() => handleCheck(blog.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
