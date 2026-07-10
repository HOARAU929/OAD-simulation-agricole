import React from 'react'
import { Link } from 'react-router-dom'
import { FaLeaf } from 'react-icons/fa'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <FaLeaf className="logo-icon" />
          <span>OAD Simulation Agricole</span>
        </Link>
        <div className="header-info">
          <span className="version">v1.0.0</span>
        </div>
      </div>
    </header>
  )
}

export default Header
