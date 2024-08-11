// src/components/CreatePost.js
import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('description', description);
    formData.append('location', location);
    for (const file of files) {
      formData.append('files', file);
    }

    // Get token from localStorage
    const token = JSON.parse(localStorage.getItem('token'));
    console.log('Token from localStorage:', token);

    try {
      const response = await axios.post('http://localhost:4000/api/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Assuming token is stored in localStorage
        }
      });
      console.log('Response from backend:', response.data);
    } catch (error) {
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" required />
      <input type="file" multiple onChange={handleFileChange} />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;
