import { Post, Comment, Like } from '../models/Post.js';
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

// In postController.js
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name') // Populate author
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name' // Populate user field in comments
        }
      })
      .exec();

    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



export const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    console.log("Post ID:", postId);
    console.log("User ID:", userId);

    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike) {
      return res.status(400).json({ error: 'You already liked this post' });
    }

    const newLike = new Like({ user: userId, post: postId });
    await newLike.save();

    await Post.findByIdAndUpdate(postId, { $push: { likes: newLike._id } });
    res.status(201).json(newLike);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    // Find and remove the like
    const like = await Like.findOneAndDelete({ user: userId, post: postId });
    if (!like) {
      return res.status(400).json({ error: 'You have not liked this post' });
    }

    // Remove the like from the post's likes array
    await Post.findByIdAndUpdate(postId, { $pull: { likes: like._id } });
    res.status(200).json({ message: 'Post unliked successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Add a comment to a post
export const addComment = async (req, res) => {
  const { content, parent } = req.body;
  const postId = req.params.postId;
  const userId = req.user.id;

  const newComment = new Comment({
    user: userId,
    post: postId,
    content,
    parent
  });

  try {
    const savedComment = await newComment.save();
    await Post.findByIdAndUpdate(postId, { $push: { comments: savedComment._id } });
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get post details including comments and likes
export const getPostDetails = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'name') // Populate author
      .populate('likes') // Populate likes if necessary
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name' // Populate user field in comments
        }
      })
      .exec();

    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};