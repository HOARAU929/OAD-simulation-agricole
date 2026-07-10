import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import CultureManagement from './pages/CultureManagement'
import SimulationPage from './pages/SimulationPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Header />
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/cultures" element={<CultureManagement />} />
              <Route path="/simulations" element={<SimulationPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
