import { Post, Like, Comment } from '../models/Post.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const createPost = async (req, res) => {

  console.log('User object:', req.user);
  console.log('User ID:', req.user ? req.user.id : 'User is undefined');

  const { title, content, description, location } = req.body;
  let imageUrls = [];
  let videoUrls = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const fileType = file.mimetype.split('/')[0];
      const url = await uploadOnCloudinary(file.path);
      if (fileType === 'image') {
        imageUrls.push(url);
      } else if (fileType === 'video') {
        videoUrls.push(url);
      }
    }
  }

  const newPost = new Post({
    author: req.user.id,
    title,
    content,
    description,
    location,
    imageUrl: imageUrls.length ? imageUrls : undefined,
    videoUrl: videoUrls.length ? videoUrls : undefined
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
    const like = await Like.findOne({ user: req.user.id, post: req.params.postId });
    if (like) {
      res.status(400).json({ error: 'You already liked this post' });
    } else {
      const newLike = new Like({ user: req.user.id, post: req.params.postId });
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
    user: req.user.id,
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
      .populate('author', 'name') // Assuming 'name' instead of 'username'
      .exec();
    const comments = await Comment.find({ post: req.params.postId, parent: null })
      .populate('user', 'name')
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'name' }
      })
      .exec();
    const likes = await Like.find({ post: req.params.postId }).exec();
    res.status(200).json({ post, comments, likes });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
