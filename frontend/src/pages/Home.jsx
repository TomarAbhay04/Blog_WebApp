import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://blog-webapp-2rak.onrender.com/api/posts/');
        setPosts(response.data);
        // Initialize likedPosts from response if possible
        const likedPostIds = response.data
          .filter(post => post.likes.some(like => like.user === JSON.parse(localStorage.getItem('user')).id))
          .map(post => post._id);
        setLikedPosts(new Set(likedPostIds));
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      if (likedPosts.has(postId)) {
        // If already liked, send request to unlike
        await axios.delete(`https://blog-webapp-2rak.onrender.com/api/posts/${postId}/like`, {
          headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}` }
        });
        setLikedPosts(prev => {
          const updatedLikes = new Set(prev);
          updatedLikes.delete(postId);
          return updatedLikes;
        });
      } else {
        // If not liked, send request to like
        await axios.post(`https://blog-webapp-2rak.onrender.com/api/posts/${postId}/like`, {}, {
          headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}` }
        });
        setLikedPosts(prev => new Set(prev).add(postId));
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const response = await axios.post(`https://blog-webapp-2rak.onrender.com/api/posts/${postId}/comment`, {
        content: newComment,
        parent: null
      }, {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}` }
      });
      // Update local state to include new comment
      setPosts(prevPosts => prevPosts.map(post => 
        post._id === postId ? { ...post, comments: [...post.comments, response.data] } : post
      ));
      setNewComment('');
      setCommentingPostId(null);
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  return (
    <div className="home-page">
      <h1>Home Page</h1>
      {posts.length > 0 ? (
        <div className="posts-container">
          {posts.map(post => (
            <div key={post._id} className="post">
              <h2 className="post-title">{post.title}</h2>
              <p className="post-content">{post.content}</p>
              <p className="post-description">{post.description}</p>
              <p className="post-location">{post.location}</p>
              <div className="post-media">
                {post.imageUrl && post.imageUrl.length > 0 && (
                  <div className="post-images">
                    {post.imageUrl.map((url, index) => (
                      <img key={index} src={url} alt={`Post Image ${index + 1}`} className="post-image" />
                    ))}
                  </div>
                )}
                {post.videoUrl && post.videoUrl.length> 0 && (
                  <video controls className="post-video">
                    <source src={post.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div className="post-actions">
                <button
                  className="like-button"
                  onClick={() => handleLike(post._id)}
                  style={{ backgroundColor: likedPosts.has(post._id) ? 'red' : 'gray' }}
                >
                  {likedPosts.has(post._id) ? 'Unlike' : 'Like'}
                </button>
                <button className="comment-button" onClick={() => setCommentingPostId(post._id)}>Comment</button>
              </div>
              {commentingPostId === post._id && (
                <div className="comment-form">
                  <textarea
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Write a comment..."
                  />
                  <button onClick={() => handleCommentSubmit(post._id)}>Submit</button>
                </div>
              )}
              {post.comments && post.comments.length > 0 && (
                <div className="comments-section">
                  {post.comments.map(comment => (
                    <div key={comment._id} className="comment">
                      <p><strong>{comment.user.name}</strong>: {comment.content}</p>
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="replies">
                          {comment.replies.map(reply => (
                            <div key={reply._id} className="reply">
                              <p><strong>{reply.user.name}</strong>: {reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default Home;