import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import Listing from '../models/listing.model.js';

const router = express.Router();

router.post('/create', verifyToken, async (req, res) => {
  try {
    const newListing = await Listing.create(req.body);
    res.status(201).json(newListing); // ✅ This is the required line
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
