import Roadmap from '../models/Roadmap.js';
import { generateRoadmap } from '../services/aiService.js';

const badRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

export const createRoadmap = async (req, res, next) => {
  try {
    const {
      targetCompanies,
      branch,
      year,
      availableHoursPerDay,
      skillLevel,
    } = req.body || {};

    if (!Array.isArray(targetCompanies) || targetCompanies.length === 0) {
      throw badRequest('targetCompanies must be a non-empty array');
    }
    if (!branch || !year || !skillLevel) {
      throw badRequest('branch, year and skillLevel are required');
    }
    if (!Number.isFinite(Number(availableHoursPerDay)) || Number(availableHoursPerDay) <= 0) {
      throw badRequest('availableHoursPerDay must be a positive number');
    }

    const existingRoadmap = await Roadmap.findOne({ user: req.user.id, status: 'Active' });
    if (existingRoadmap) {
      existingRoadmap.status = 'Paused';
      await existingRoadmap.save();
    }

    const aiPlan = await generateRoadmap({
      branch,
      year,
      targetCompanies,
      availableHoursPerDay: Number(availableHoursPerDay),
      skillLevel,
    });

    if (!Array.isArray(aiPlan.weeks) || aiPlan.weeks.length === 0) {
      throw new Error('AI returned an empty roadmap');
    }

    const roadmap = await Roadmap.create({
      user: req.user.id,
      targetCompanies,
      branch,
      year,
      availableHoursPerDay: Number(availableHoursPerDay),
      skillLevel,
      plan: aiPlan.weeks,
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
    const weekIndex = Number(req.body?.weekIndex);
    const topicIndex = Number(req.body?.topicIndex);

    if (!Number.isInteger(weekIndex) || !Number.isInteger(topicIndex) || weekIndex < 0 || topicIndex < 0) {
      throw badRequest('weekIndex and topicIndex must be non-negative integers');
    }

    const roadmap = await Roadmap.findOne({ user: req.user.id, status: 'Active' });
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

    if (!roadmap.plan[weekIndex] || !roadmap.plan[weekIndex].topics[topicIndex]) {
      throw badRequest('Invalid roadmap task');
    }

    roadmap.plan[weekIndex].topics[topicIndex].isCompleted =
      !roadmap.plan[weekIndex].topics[topicIndex].isCompleted;

    await roadmap.save();
    res.status(200).json(roadmap);
  } catch (error) {
    next(error);
  }
};
