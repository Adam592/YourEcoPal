import React from 'react';
import { Navbar, Image } from 'react-bootstrap';
import logo from '../../../assets/logo192.png';


const Header = () => {
    return (
        <header className="mb-auto p-3">
        <Navbar expand="md" className="px-3">
          <Navbar.Brand className="d-flex align-items-center">
            <Image
              src={logo}
              width="40"
              height="40"
              className="me-2"
              roundedCircle
              alt="YourEcoPal Logo"
            />
            <span className="fs-4 fw-bold">YourEcoPal</span>
          </Navbar.Brand>
        </Navbar>
      </header>
    )
}
export default Header