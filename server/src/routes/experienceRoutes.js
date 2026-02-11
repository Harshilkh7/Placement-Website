import express from 'express';
import { submitExperience, getAllExperiences, getExperienceById, moderateExperience } from '../controllers/experienceController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllExperiences);
router.get('/:id', protect, getExperienceById);
router.post('/', protect, submitExperience);
router.patch('/:id/moderate', protect, authorize('admin'), moderateExperience);

export default router;
