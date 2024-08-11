// src/components/CreatePost.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Createpost.css';


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

    const token = JSON.parse(localStorage.getItem('token'));

    try {
      const response = await axios.post('https://blog-webapp-2rak.onrender.comapi/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Response from backend:', response.data);
    } catch (error) {
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
    }
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Title" 
        className="create-post-input" 
        required 
      />
      <textarea 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        placeholder="Content" 
        className="create-post-textarea" 
        required 
      />
      <textarea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="Description" 
        className="create-post-textarea" 
        required 
      />
      <input 
        type="text" 
        value={location} 
        onChange={(e) => setLocation(e.target.value)} 
        placeholder="Location" 
        className="create-post-input" 
        required 
      />
      <input 
        type="file" 
        multiple 
        onChange={handleFileChange} 
        className="create-post-file-input" 
      />
      <button type="submit" className="create-post-button">Create Post</button>
    </form>
  );
};

export default CreatePost;
CreatePost.css