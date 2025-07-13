import express from 'express';
import multer from 'multer';
import { storage } from '../utils/cloudinary.js';
import { verifyToken } from '../utils/verifyUser.js'; // ✅ Import added

const router = express.Router();
const upload = multer({ storage });

router.post('/', verifyToken, upload.single('image'), (req, res) => { // ✅ Middleware added
  try {
    console.log(' Upload route called');

    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(' File uploaded:', req.file);
    res.status(200).json({ imageUrl: req.file.path });
  } catch (err) {
    console.error('🔥 Upload failed:', err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

export default router;
