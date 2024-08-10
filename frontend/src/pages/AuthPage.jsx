import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const AuthPage = () => {
  const navigate = useNavigate();
  const { loginUser, registerUser } = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState('');

  const toggleMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
    setError(''); // Clear any existing error when switching modes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLoginMode) {
        await loginUser({ email, password });
      } else {
        await registerUser({ name, email, password });
      }

      navigate('/'); // Redirect to home page after successful login or registration
      setError(''); // Clear any existing error on successful submission
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred.'); // Display error message
    }
  };

  return (
    <div className="auth-form">
      <h2>{isLoginMode ? 'Login' : 'Register'}</h2>
      {error && <div className="error-message">{error}</div>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ position: 'relative' }}>
          <label>Password</label>
          <input
            type={showPassword ? 'text' : 'password'} // Toggle between text and password type
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ paddingRight: '30px' }} // Add space for the icon
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={() => setShowPassword((prevState) => !prevState)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '35px',
              cursor: 'pointer',
            }}
          />
        </div>
        {!isLoginMode && ( // Conditionally render the Name field only in registration mode
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <button type="submit">{isLoginMode ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={toggleMode} className="toggle-button">
        Switch to {isLoginMode ? 'Register' : 'Login'}
      </button>
    </div>
  );
};

export default AuthPage;
