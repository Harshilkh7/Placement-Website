import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { analyzeResume, generateRoadmap, getInterviewFeedback, summarizeExperience } from '../services/aiService.js';

const router = express.Router();
router.use(protect);

router.post('/resume', async (req, res, next) => {
  try { res.json(await analyzeResume(req.body.resumeText)); } catch (error) { next(error); }
});
router.post('/roadmap', async (req, res, next) => {
  try { res.json(await generateRoadmap(req.body)); } catch (error) { next(error); }
});
router.post('/interview-feedback', async (req, res, next) => {
  try { res.json(await getInterviewFeedback(req.body.transcript)); } catch (error) { next(error); }
});
router.post('/experience-summary', async (req, res, next) => {
  try { res.json(await summarizeExperience(req.body.experienceContent)); } catch (error) { next(error); }
});

export default router;
