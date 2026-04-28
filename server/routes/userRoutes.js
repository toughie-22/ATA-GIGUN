const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Follow a user
// @route   POST /api/users/:id/follow
router.post('/:id/follow', protect, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) return res.status(404).json({ message: 'User not found' });
    if (userToFollow._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      // Unfollow
      currentUser.following = currentUser.following.filter(id => id.toString() !== userToFollow._id.toString());
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== currentUser._id.toString());
    } else {
      // Follow
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
      
      // Notify
      await Notification.create({
        recipient: userToFollow._id,
        sender: currentUser._id,
        type: 'FOLLOW'
      });
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({ following: currentUser.following, followers: userToFollow.followers });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get notifications
// @route   GET /api/users/notifications
router.get('/notifications', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'username avatar')
      .populate('relatedMovie', 'title')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Mark notifications as read
// @route   PUT /api/users/notifications/read
router.put('/notifications/read', protect, async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id }, { isRead: true });
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
