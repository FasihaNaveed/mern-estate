import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    const newListing = new Listing({
      ...req.body,
      userRef: req.user.id, // ✅ This will fix the missing userRef issue
    });
    await newListing.save();
    res.status(201).json(newListing);
  } catch (error) {
    next(error);
  }
};
