import { Link } from 'react-router-dom'

const Blogs = ({ blogs, handleCheck, user }) => {

	return (
		<div>
			<h2>Blogs</h2>

			<ul>
				{blogs.map((blog) => (

					<li key={blog.id} className={user.name === blog.user.name ? 'blog-item' : 'blog-item-without-checkbox'}>
						{
							user.name === blog.user.name ? (
								<input
									className='form-check-input m-1'
									type='checkbox'
									id='myCheck'
									checked={blog.checked}
									onChange={() => handleCheck(blog.id)}
								></input>
							) : ''
						}
						<Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Blogs