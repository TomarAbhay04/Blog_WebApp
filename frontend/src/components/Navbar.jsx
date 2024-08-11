// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav>
      <h2>My Blog</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/create-post">CreatePost</Link></li>
        <li><Link to="/search">Search Friends</Link></li>
        <li><Link to="/friends-list">Friends List</Link></li>
        {user ? (
          <>
            <li>{user.name}</li> {/* Display user name */}
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/auth">Login / Register</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;