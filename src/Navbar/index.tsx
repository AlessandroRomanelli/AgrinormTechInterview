import React from "react"
import {Container, Nav, Navbar as RBNavbar} from "react-bootstrap";
import {NavLink as Link} from "react-router-dom";
import Logo from "../Components/Logo";

const Navbar: React.FC = () => {
	return <RBNavbar bg="light" expand="lg">
		<Container>
			<RBNavbar.Brand as={Link} to="/">
				<Logo size={48}/>
			</RBNavbar.Brand>
			<RBNavbar.Toggle aria-controls="basic-navbar-nav" />
			<RBNavbar.Collapse id="basic-navbar-nav">
				<Nav className="me-auto">
					<Nav.Link as={Link} to={'/'}>Home</Nav.Link>
					<Nav.Link as={Link} to={'/management'}>Management</Nav.Link>
					<Nav.Link as={Link} to={'/inspector'}>Inspectors' Area</Nav.Link>
				</Nav>
			</RBNavbar.Collapse>
		</Container>
	</RBNavbar>
}

export default Navbar
