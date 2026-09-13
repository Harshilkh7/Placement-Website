import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  analyzeResume,
  generateRoadmap,
  getInterviewFeedback,
  summarizeExperience,
} from '../services/aiService.js';

const router = express.Router();
router.use(protect);

const requireText = (value, field) => {
  if (typeof value !== 'string' || !value.trim()) {
    const error = new Error(`${field} is required`);
    error.statusCode = 400;
    throw error;
  }
  return value.trim();
};

router.post('/resume', async (req, res, next) => {
  try {
    const resumeText = requireText(req.body?.resumeText, 'resumeText');
    res.json(await analyzeResume(resumeText));
  } catch (error) {
    next(error);
  }
});

router.post('/roadmap', async (req, res, next) => {
  try {
    res.json(await generateRoadmap(req.body || {}));
  } catch (error) {
    next(error);
  }
});

router.post('/interview-feedback', async (req, res, next) => {
  try {
    const transcript = requireText(req.body?.transcript, 'transcript');
    res.json(await getInterviewFeedback(transcript));
  } catch (error) {
    next(error);
  }
});

router.post('/experience-summary', async (req, res, next) => {
  try {
    const experienceContent = requireText(
      req.body?.experienceContent,
      'experienceContent',
    );
    res.json(await summarizeExperience(experienceContent));
  } catch (error) {
    next(error);
  }
});

export default router;
