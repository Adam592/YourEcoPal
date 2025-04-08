import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import Footer from '../../components/Footer/Footer';

const HomePage = () => {

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