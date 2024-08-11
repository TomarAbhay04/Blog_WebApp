import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SearchFriends = () => {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    console.log('Searching for:', searchTerm);

    try {
      const response = await axios.get('https://blog-webapp-2rak.onrender.comapi/users/search', {
        params: { name: searchTerm }
      });
      
      console.log('Search Results:', response.data);
      setSearchResults(response.data);

      response.data.forEach(friend => {
        console.log('Friend ID:', friend._id);
      });
    } catch (error) {
      setError('Error fetching search results.');
      console.error('Search error:', error.response?.data || error.message);
    }
  };
  
  const handleAddFriend = async (friendId) => {
    console.log('Current user context:', user);

    if (!user || !user.id) { // Use id here
      console.error('User ID is missing:', user);
      setError('User not logged in.');
      return;
    }

    try {
      console.log('Attempting to add friend with ID:', friendId);
      console.log('User ID:', user.id);

      const response = await axios.post('https://blog-webapp-2rak.onrender.comapi/users/add-friend', {
        userId: user.id, // Use id here
        friendId
      });

      console.log('Response from adding friend:', response.data);
      alert(response.data.msg);
    } catch (error) {
      console.error('Error adding friend:', error.response?.data || error.message);
      setError('Error adding friend.');
    }
  };

  return (
    <div>
      <h2>Search Friends</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <div className="error-message">{error}</div>}
      <ul>
        {searchResults.map(user => (
          <li key={user._id}>
            {user.name} ({user.email})
            <button onClick={() => {
              console.log('Friend ID clicked:', user._id);
              handleAddFriend(user._id);
            }}>
              Add Friend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchFriends;