// ----------------------
// ✅ 2. Backend: server.js
// ----------------------
// ✅ No change required, but move app.listen() to bottom

// ✅ Updated order for clarity
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log(err);
});

// ✅ Middleware order
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// ✅ Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

// ✅ Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Now start the server
app.listen(3000, () => {
  console.log('Server is running on PORT 3000!!');
});

