import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostDetail = ({ match }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`/posts/${match.params.postId}`);
        setPost(response.data.post);
        setComments(response.data.comments);
        setLikes(response.data.likes);
      } catch (err) {
        console.error('Error fetching post data:', err);
      }
    };
    fetchPostData();
  }, [match.params.postId]);

  const handleLike = async () => {
    try {
      await axios.post(`/posts/${match.params.postId}/like`);
      setLikes((prevLikes) => [...prevLikes, { user: 'you' }]); // Simplified update
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/posts/${match.params.postId}/comment`, { content: commentContent });
      setComments((prevComments) => [...prevComments, response.data]);
      setCommentContent('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p>{post.description}</p>
      <p>{post.location}</p>
      <p>{new Date(post.createdAt).toLocaleString()}</p>
      <button onClick={handleLike}>Like ({likes.length})</button>
      <div>
        <h3>Comments</h3>
        {comments.map((comment) => (
          <div key={comment._id}>
            <p>{comment.content}</p>
            <p>{comment.user.username} - {new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        ))}
        <form onSubmit={handleAddComment}>
          <textarea value={commentContent} onChange={(e) => setCommentContent(e.target.value)} required></textarea>
          <button type="submit">Add Comment</button>
        </form>
      </div>
    </div>
  );
};

export default PostDetail;