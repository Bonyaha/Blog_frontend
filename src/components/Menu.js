import {
	Link
} from 'react-router-dom'
import { Toolbar, AppBar, Button } from '@mui/material'

const Menu = () => {
	return (
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