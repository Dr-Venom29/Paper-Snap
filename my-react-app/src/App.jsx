import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Drag from './components/Drag';
import Body from './components/Body';
import About from './components/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Password from './pages/Password';
import Footer from './components/Footer'
import Summary from './pages/Summary'
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import "./App.css"

function App() {
  return (                                          //Rendering the Main component
    <BrowserRouter> 
      <Main />
    </BrowserRouter>
  );
}

function Main() {
  const location = useLocation();  // Get the current route path
  const showLayout = !['/login', '/signup', '/password', '/summary', '/privacy-policy', '/terms-of-service'].includes(location.pathname); //Determine if we should show the Navbar, Drag, and Body components

  return (
    <>
      {showLayout && (
        <>
          <Navbar />
          <Drag />
          <Body />
          <Footer />
        </>
      )}

      <Routes>
      <Route path="/" element={null} />
        <Route path="/about" element={<About />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/password" element={<Password />}/>
        <Route path="/summary" element={<Summary />}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy />}/>
        <Route path="/terms-of-service" element={<TermsOfService />}/>
      </Routes>
    </>
  );
}

export default App;
