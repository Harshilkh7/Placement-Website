import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import app from './app.js';
import logger from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/placement_portal';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'placement';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

mongoose.connect(MONGO_URI, { dbName: MONGO_DB_NAME })
  .then(() => {
    logger.info(`Connected to MongoDB database: ${MONGO_DB_NAME}`);
    httpServer.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });

io.on('connection', (socket) => {
  logger.info('A user connected');

  socket.on('join-contest', (contestId) => {
    socket.join(contestId);
  });

  socket.on('disconnect', () => {
    logger.info('User disconnected');
  });
});

export { io };
