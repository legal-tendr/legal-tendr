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
  // Simple authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const handleLogin = (email, password) => {
    // Hardcoded credentials for the prototype
    if (email === 'client@test.com' && password === 'password') {
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
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
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="discover" element={<Discover />} />
            <Route path="my-cases" element={<MyCases />} />
            <Route path="messages" element={<Messages />} />
            <Route path="account" element={<Account onLogout={handleLogout} />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
