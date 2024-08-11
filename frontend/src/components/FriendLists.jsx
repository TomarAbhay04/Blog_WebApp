import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const FriendsList = () => {
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFriends = async () => {
      console.log('Current user in FriendsList:', user); // Log the user object
  
      try {
        if (user && user.id) {
          const response = await axios.get('http://localhost:4000/api/users/friends', {
            params: { userId: user.id }
          });
          setFriends(response.data);
        } else {
          setError('User not logged in.');
        }
      } catch (error) {
        setError('Error fetching friends.');
        console.error('Error fetching friends:', error);
      }
    };
  
    fetchFriends();
  }, [user]);
  
  

  return (
    <div>
      <h2>Your Friends</h2>
      {error && <div className="error-message">{error}</div>}
      <ul>
        {friends.length > 0 ? (
          friends.map(friend => (
            <li key={friend._id}>
              {friend.name} ({friend.email})
            </li>
          ))
        ) : (
          <p>No friends found.</p>
        )}
      </ul>
    </div>
  );
};

export default FriendsList;
