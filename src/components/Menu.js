import {
	Link
} from 'react-router-dom'

const Menu = () => {
	const padding = {
		padding: 5,
		textDecoration: 'none',
	}
	return (
		<div className='navMenu'>
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
		</div>
	)
}

export default Menu