import User from '../models/User.js';

export const searchUsers = async (req, res) => {
    const { name } = req.query; // Get name from query params

    try {
        if (!name) {
            return res.status(400).json({ msg: 'Name query parameter is required' });
        }

        // Find users by name (case-insensitive search)
        const users = await User.find({
            name: { $regex: name, $options: 'i' }
        }).select('name email'); // Return only name and email

        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};



export const addFriend = async (req, res) => {
    const { userId, friendId } = req.body;

    try {
        if (!userId || !friendId) {
            return res.status(400).json({ msg: 'User ID and Friend ID are required' });
        }

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ msg: 'User or friend not found' });
        }

        if (!user.friends.includes(friendId)) {
            user.friends.push(friendId);
            await user.save();
        }

        res.json({ msg: 'Friend added successfully' });
    } catch (error) {
        console.error('Error in addFriend:', error.message);
        res.status(500).send('Server Error');
    }
};

export const getFriends = async (req, res) => {
    const { userId } = req.query;
  
    console.log('Received userId:', userId); // Log the received userId
  
    try {
      if (!userId) {
        return res.status(400).json({ msg: 'User ID query parameter is required' });
      }
  
      const user = await User.findById(userId).populate('friends', 'name email'); // Populate friends field
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      res.json(user.friends);
    } catch (error) {
      console.error('Error in getFriends:', error.message);
      res.status(500).send('Server Error');
    }
  };
  