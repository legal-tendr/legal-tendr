import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

// Page Components
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Discover from './pages/Discover'
import MyCases from './pages/MyCases'
import Messages from './pages/Messages'
import Account from './pages/Account'

function App() {
  // Simple authentication state - start as false to require login
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('isAuthenticated');
    return saved === 'true';
  })
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  })

  const handleLogin = (email, password, userData) => {
    // Updated to work with real API - store actual user data from login response
    console.log('App.jsx - handleLogin called with userData:', userData);
    setIsAuthenticated(true)
    
    // Extract user data from the nested API response structure
    const actualUserData = userData.data || userData;
    console.log('App.jsx - Extracted user data:', actualUserData);
    
    // The data is nested one more level deep
    const userDetails = actualUserData.data || actualUserData;
    console.log('App.jsx - User details:', userDetails);
    
    const userObj = {
      id: userDetails.user_id,
      email: userDetails.email,
      userType: userDetails.user_type,
      isVerified: userDetails.is_verified,
      lastOnline: userDetails.last_online
    };
    console.log('App.jsx - Setting currentUser to:', userObj);
    setCurrentUser(userObj)
    
    // Persist to localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(userObj));
    
    return true
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    
    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/discover" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/signup" 
            element={isAuthenticated ? <Navigate to="/discover" /> : <SignUp onLogin={handleLogin} />} 
          />
          <Route path="/" element={isAuthenticated ? <MainLayout onLogout={handleLogout} /> : <Navigate to="/login" />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard user={currentUser} />} />
            <Route path="discover" element={<Discover user={currentUser} />} />
            <Route path="my-cases" element={<MyCases user={currentUser} />} />
            <Route path="messages" element={<Messages />} />
            <Route path="account" element={<Account onLogout={handleLogout} user={currentUser} />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
