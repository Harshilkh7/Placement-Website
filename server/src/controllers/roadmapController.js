import Roadmap from '../models/Roadmap.js';
import { generateRoadmap } from '../services/aiService.js';
import logger from '../utils/logger.js';

export const createRoadmap = async (req, res, next) => {
  try {
    const { targetCompanies, branch, year, availableHoursPerDay, skillLevel } = req.body;
    
    // Check if user already has an active roadmap
    const existingRoadmap = await Roadmap.findOne({ user: req.user.id, status: 'Active' });
    if (existingRoadmap) {
      existingRoadmap.status = 'Paused';
      await existingRoadmap.save();
    }

    const aiPlan = await generateRoadmap({
      branch,
      year,
      targetCompanies,
      availableHoursPerDay,
      skillLevel
    });

    const roadmap = await Roadmap.create({
      user: req.user.id,
      targetCompanies,
      branch,
      year,
      availableHoursPerDay,
      skillLevel,
      plan: aiPlan.weeks || aiPlan.plan
    });

    res.status(201).json(roadmap);
  } catch (error) {
    next(error);
  }
};

export const getMyRoadmap = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findOne({ user: req.user.id, status: 'Active' });
    if (!roadmap) {
      return res.status(404).json({ message: 'No active roadmap found' });
    }
    res.status(200).json(roadmap);
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { weekIndex, topicIndex } = req.body;
    const roadmap = await Roadmap.findOne({ user: req.user.id, status: 'Active' });
    
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

    roadmap.plan[weekIndex].topics[topicIndex].isCompleted = !roadmap.plan[weekIndex].topics[topicIndex].isCompleted;
    await roadmap.save();

    res.status(200).json(roadmap);
  } catch (error) {
    next(error);
  }
};
