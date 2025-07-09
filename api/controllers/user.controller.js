import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

// ✅ Test route (for initial server check)
export const test = (req, res) => {
  res.json({ message: 'API Route is working' });
};

// ✅ Update user route
export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can only update your account!'));
    }

    // Prepare only fields that need to be updated
    const fieldsToUpdate = {
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar,
    };

    if (req.body.password) {
      fieldsToUpdate.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: fieldsToUpdate },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.log('Update Error:', error);
    next(error);
  }
};

// ✅ Delete user route
export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can only delete your account!'));
    }

    await User.findByIdAndDelete(req.params.id);

    try {
      res.clearCookie('access_token');
    } catch (err) {
      console.log('Clear cookie error:', err);
    }

    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

// ✅ Get user-specific listings
export const getUserListings = async (req, res, next) => {
      if (req.user.id === req.params.id) {
  try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings);
    } catch (error) {
    next(error);
  }
} else {
        return next(errorHandler(401, 'You can only view your listings'));
 }
};
