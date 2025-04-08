import React from 'react';
import { Container} from 'react-bootstrap';
import { FaLeaf } from 'react-icons/fa';
const Footer = () => {
  return (
    <footer className="mt-auto text-center text-md-start py-4 border-top" id="contact">
        <Container>
          <div className="row align-items-center">
            <div className="col-12 col-md-6 mb-3 mb-md-0">
              <span className="text-body-secondary">© 2025 YourEcoPal. All rights reserved.</span>
            </div>
            
            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-end">
              <FaLeaf size={20} color="green" className="me-2" />
              <span style={{ color: 'green', fontWeight: '500' }}>Making Earth Greener</span>
            </div>
          </div>
        </Container>
     </footer>
  );
};

export default Footer;
