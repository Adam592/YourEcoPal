import React from 'react';
import { Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { BsBarChartFill, BsQrCodeScan, BsCarFrontFill, BsPersonCircle, BsWater} from 'react-icons/bs';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { logout } from '../../../services/firebase/authService';
import { useNavigate } from 'react-router-dom';

const BottomNav = ({ activeComponent, setActiveComponent }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar bg="white" fixed="bottom" className="border-top px-3">
      <Nav className="w-100 d-flex justify-content-around align-items-center">
        <Button
          variant="link"
          onClick={() => setActiveComponent('dashboard')}
        >
          <BsBarChartFill
            size={24}
            color={activeComponent === 'dashboard' ? '#38B000' : '#6c757d'}
          />
        </Button>

        <Button
          variant="link"
          onClick={() => setActiveComponent('qrscanner')}
        >
          <BsQrCodeScan
            size={24}
            color={activeComponent === 'qrscanner' ? '#38B000' : '#6c757d'}
          />
        </Button>

        <Button
          variant="link"
          onClick={() => setActiveComponent('activity')}
        >
          <BsCarFrontFill
            size={24}
            color={activeComponent === 'activity' ? '#38B000' : '#6c757d'}
          />
        </Button>

        <Button
          variant="link"
          onClick={() => setActiveComponent('water')}
        >
          <BsWater 
            size={24}
            color={activeComponent === 'water' ? '#38B000' : '#6c757d'}
          />
        </Button>

        <Dropdown drop="up" align="end">
          <Dropdown.Toggle as={Button} variant="link" className="p-0 border-0 shadow-none">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="rounded-circle"
                width="28"
                height="28"
              />
            ) : (
              <BsPersonCircle size={26} color="#6c757d" />
            )}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => alert('Profile screen coming soon!')}>Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => logout().then(() => navigate('/login'))}>
              Sign out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default BottomNav;
