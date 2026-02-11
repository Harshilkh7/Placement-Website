import InterviewExperience from '../models/InterviewExperience.js';
import { summarizeExperience } from '../services/aiService.js';
import logger from '../utils/logger.js';

export const submitExperience = async (req, res, next) => {
  try {
    const { companyName, role, rounds, preparationTips, difficultyRating, offerStatus, isAnonymous } = req.body;

    const experience = await InterviewExperience.create({
      author: req.user.id,
      companyName,
      role,
      rounds,
      preparationTips,
      difficultyRating,
      offerStatus,
      isAnonymous
    });

    // Process with AI asynchronously
    const fullContent = rounds.map(r => `${r.roundName}: ${r.content}`).join('\n');
    summarizeExperience(fullContent).then(async (aiResult) => {
      experience.aiSummary = aiResult.aiSummary;
      experience.extractedQuestions = aiResult.extractedQuestions;
      await experience.save();
      logger.info(`AI processing completed for experience: ${experience._id}`);
    }).catch(err => {
      logger.error(`AI processing failed for experience: ${experience._id}`, err);
    });

    res.status(201).json({
      message: 'Experience submitted and is pending moderation',
      experience
    });
  } catch (error) {
    next(error);
  }
};

export const getAllExperiences = async (req, res, next) => {
  try {
    const experiences = await InterviewExperience.find({ status: 'Approved' })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(experiences);
  } catch (error) {
    next(error);
  }
};

export const getExperienceById = async (req, res, next) => {
  try {
    const experience = await InterviewExperience.findById(req.params.id)
      .populate('author', 'name');
    
    if (!experience || (experience.status !== 'Approved' && req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    res.status(200).json(experience);
  } catch (error) {
    next(error);
  }
};

export const moderateExperience = async (req, res, next) => {
  try {
    const { status } = req.body;
    const experience = await InterviewExperience.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(experience);
  } catch (error) {
    next(error);
  }
};
