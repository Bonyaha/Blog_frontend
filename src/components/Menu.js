import {
	Link
} from 'react-router-dom'
import { Toolbar, AppBar, Button } from '@mui/material'

const Menu = () => {
	/* const padding = {
		padding: 5,
		textDecoration: 'none',
	} */
	return (
		/*{ <div className='navMenu'>
			<Link style={padding} to='/'>
				home
			</Link>
			<Link style={padding} to="/blogs">blogs</Link>
			<Link style={padding} to='/create'>
				create new
			</Link>
			<Link style={padding} to='/about'>
				about
			</Link>
			<Link style={padding} to='/users'>
				users
			</Link>
		</div> }*/

		<AppBar position="static" style={{ marginBottom: '10px' }} >
			<Toolbar>
				<Button color="inherit" component={Link} to="/">
					home
				</Button>
				<Button color="inherit" component={Link} to="/blogs">
					blogs
				</Button>
				<Button color="inherit" component={Link} to='/create'>
					create new
				</Button>
				<Button color="inherit" component={Link} to='/about'>
					about
				</Button>
				<Button color="inherit" component={Link} to="/users">
					users
				</Button>
			</Toolbar>
		</AppBar >
	)
}

export default Menu