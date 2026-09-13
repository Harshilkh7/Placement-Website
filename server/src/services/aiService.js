import OpenAI from 'openai';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || 'gpt-5.6-luna';
const openai = apiKey && apiKey !== 'your_openai_api_key_here'
  ? new OpenAI({ apiKey })
  : null;

const runJson = async (systemPrompt, userPrompt) => {
  if (!openai) {
    const error = new Error('AI service not configured');
    error.statusCode = 503;
    throw error;
  }

  const response = await openai.responses.create({
    model,
    input: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const output = response.output_text?.trim();
  if (!output) throw new Error('AI service returned an empty response');

  try {
    return JSON.parse(output);
  } catch {
    const error = new Error('AI service returned invalid JSON');
    error.statusCode = 502;
    throw error;
  }
};

export const analyzeResume = async (resumeText) => {
  try {
    return await runJson(
      'You are an expert ATS and career coach. Return only valid JSON, with no markdown.',
      `Analyze this resume. Return an object containing atsScore (0-100), missingSkills (array), and improvementSuggestions (array). Resume:\n${resumeText}`,
    );
  } catch (error) {
    logger.error('AI Resume Analysis Error:', error);
    throw error;
  }
};

export const generateRoadmap = async (userData = {}) => {
  try {
    const targetCompanies = Array.isArray(userData.targetCompanies)
      ? userData.targetCompanies.join(', ')
      : String(userData.targetCompanies || 'Not specified');

    return await runJson(
      'You are a career mentor. Return only valid JSON, with no markdown.',
      `Generate a personalized placement preparation roadmap. Return an object with a weeks array. Each week must contain week, topics, resources, and tasks. Student details: Branch: ${userData.branch || 'Not specified'}, Year: ${userData.year || 'Not specified'}, Target Companies: ${targetCompanies}, Available Hours/Day: ${userData.availableHoursPerDay || 'Not specified'}, Skill Level: ${userData.skillLevel || 'Not specified'}.`,
    );
  } catch (error) {
    logger.error('AI Roadmap Generation Error:', error);
    throw error;
  }
};

export const getInterviewFeedback = async (transcript) => {
  try {
    return await runJson(
      'You are a technical interviewer. Return only valid JSON, with no markdown.',
      `Evaluate this interview transcript. Return an object containing confidenceScore (0-100), weakAreas (array), suggestedResources (array), overallRating (0-10), and comments. Transcript:\n${transcript}`,
    );
  } catch (error) {
    logger.error('AI Interview Feedback Error:', error);
    throw error;
  }
};

export const summarizeExperience = async (experienceContent) => {
  try {
    return await runJson(
      'Summarize interview experiences. Return only valid JSON, with no markdown.',
      `Summarize this interview experience. Return an object containing aiSummary and extractedQuestions, where extractedQuestions is an array of objects with question, topic, and difficulty. Experience:\n${experienceContent}`,
    );
  } catch (error) {
    logger.error('AI Experience Summarization Error:', error);
    throw error;
  }
};
