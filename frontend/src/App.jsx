import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

// Page Components
import Dashboard from './pages/Dashboard';
import IPSubmission from './pages/IPSubmission';
import NFTGallery from './pages/NFTGallery';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { Web3Provider } from './context/Web3Context';
import { UserProvider } from './context/UserContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading Blockchain IP Protection Platform...</p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Web3Provider>
        <UserProvider>
          <Router>
            <div className="app-container">
              <Header />
              <div className="content-wrapper">
                <Sidebar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/submit" element={<IPSubmission />} />
                    <Route path="/gallery" element={<NFTGallery />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
              </div>
              <Footer />
            </div>
          </Router>
        </UserProvider>
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;
