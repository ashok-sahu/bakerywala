import React from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  FormControl,
  Button,
  NavDropdown,
  Nav,
  Form,
} from "react-bootstrap";

const Header = () => {
  return (
    <Navbar bg="transparent" expand="lg" fixed="top">
      <Navbar.Brand href="#home">
        <img
          src={require("../../assets/images/logo.png")}
          alt="logo"
          className="w-30 h-20"
        />
        <span>Bakerywala</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto ">
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="#link">About us</Nav.Link>
          <Nav.Link href="#link">Contact</Nav.Link>
          <Nav.Link href="#link">Gallery</Nav.Link>
          <Nav.Link href="#link">blog</Nav.Link>
          <Nav.Link href="#link"><Link to='/login'>Login</Link></Nav.Link>

          {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
      </NavDropdown> */}
        </Nav>
        {/* <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <Button variant="outline-success">Search</Button>
    </Form> */}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
