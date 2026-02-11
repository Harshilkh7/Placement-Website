import express from 'express';
import { createRoadmap, getMyRoadmap, updateTaskStatus } from '../controllers/roadmapController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createRoadmap);
router.get('/me', getMyRoadmap);
router.patch('/task', updateTaskStatus);

export default router;
