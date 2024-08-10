import { Post, Like, Comment } from '../models/Post.js'

export const createPost = async (req, res) => {
    const { title, content, description, location } = req.body;
    const newPost = new Post({
      author: req.user._id,
      title,
      content,
      description,
      location
    });
    try {
      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  export const likePost = async (req, res) => {
        try {
          const like = await Like.findOne({ user: req.user._id, post: req.params.postId });
          if (like) {
            res.status(400).json({ error: 'You already liked this post' });
          } else {
            const newLike = new Like({ user: req.user._id, post: req.params.postId });
            await newLike.save();
            res.status(201).json(newLike);
          }
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      };

     export const addComment = async (req, res) => {
            const { content, parent } = req.body;
  const newComment = new Comment({
    user: req.user._id,
    post: req.params.postId,
    content,
    parent
  });
  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPostDetails = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
          .populate('author', 'username')
          .exec();
        const comments = await Comment.find({ post: req.params.postId, parent: null })
          .populate('user', 'username')
          .populate({
            path: 'replies',
            populate: { path: 'user', select: 'username' }
          })
          .exec();
        const likes = await Like.find({ post: req.params.postId }).exec();
        res.status(200).json({ post, comments, likes });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    };