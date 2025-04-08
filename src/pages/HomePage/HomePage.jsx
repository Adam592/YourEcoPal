import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import Footer from '../../components/Footer/Footer';
import { useAuth } from "../../features/auth/context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isEmailVerified } = useAuth();
  const from = location.state?.from?.pathname || "/main";

  useEffect(() => {
      if (isAuthenticated) {
        if (isEmailVerified) {
          navigate(from, { replace: true });
        } else {
          navigate("/verify-email-notice", { replace: true });
        }
      }
    }, [isAuthenticated, isEmailVerified, navigate, from]);
  

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header/>
      
      <main className="flex-grow-1">
        <HeroSection/>
        <FeatureSection/>
      </main>

      <Footer/>
    </div>
  );
};

export default HomePage;