import { Link } from 'react-router-dom'
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Paper,
	Checkbox
} from '@mui/material'
const Blogs = ({ blogs, user, handleCheck }) => {
	console.log(blogs)
	return (
		<div>
			<h2>Blogs</h2>

			<TableContainer component={Paper}>
				<Table>
					<TableBody>
						{blogs.map((blog) => (

							<TableRow key={blog.id}>
								{user.name === blog.user.name ?
									<TableCell>
										<Checkbox
											checked={blog.checked}
											onChange={() => handleCheck(blog.id)}
										/>
									</TableCell>
									: (
										<TableCell /> // Empty TableCell for layout consistency
									)
								}
								<TableCell>
									<Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
								</TableCell>
								<TableCell>
									{blog.user.username}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	)
}

export default Blogs