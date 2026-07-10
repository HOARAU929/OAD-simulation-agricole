import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaHome, FaLeaf, FaFlask } from 'react-icons/fa'
import './Sidebar.css'

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FaHome className="nav-icon" />
          <span>Tableau de bord</span>
        </NavLink>
        <NavLink to="/cultures" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FaLeaf className="nav-icon" />
          <span>Cultures</span>
        </NavLink>
        <NavLink to="/simulations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FaFlask className="nav-icon" />
          <span>Simulations</span>
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
