import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);  // Close the menu
    navigate('/auth');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);  // Close the menu when a link is clicked
  };

  return (
    <nav>
      <h2>Tomar Abhay</h2>
      <div className={`menu-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/create-post" onClick={closeMenu}>CreatePost</Link></li>
        <li><Link to="/search" onClick={closeMenu}>Search Friends</Link></li>
        <li><Link to="/friends-list" onClick={closeMenu}>Friends List</Link></li>
        {user ? (
          <>
            <li>{user.name}</li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/auth" onClick={closeMenu}>Login / Register</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
