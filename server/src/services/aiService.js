import OpenAI from 'openai';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || 'gpt-5.6-luna';
const openai = apiKey && apiKey !== 'your_openai_api_key_here'
  ? new OpenAI({ apiKey })
  : null;

const runJson = async (name, schema, systemPrompt, userPrompt) => {
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
    text: {
      format: {
        type: 'json_schema',
        name,
        strict: true,
        schema,
      },
    },
  });

  if (response.status && response.status !== 'completed') {
    const error = new Error(`AI response was not completed: ${response.status}`);
    error.statusCode = 502;
    throw error;
  }

  const output = response.output_text?.trim();
  if (!output) {
    const error = new Error('AI service returned an empty response');
    error.statusCode = 502;
    throw error;
  }

  try {
    return JSON.parse(output);
  } catch {
    const error = new Error('AI service returned invalid JSON');
    error.statusCode = 502;
    throw error;
  }
};

const resumeSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    atsScore: { type: 'integer', minimum: 0, maximum: 100 },
    missingSkills: { type: 'array', items: { type: 'string' } },
    improvementSuggestions: { type: 'array', items: { type: 'string' } },
  },
  required: ['atsScore', 'missingSkills', 'improvementSuggestions'],
};

const roadmapSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    weeks: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          week: { type: 'integer', minimum: 1 },
          topics: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                title: { type: 'string' },
                resources: { type: 'array', items: { type: 'string' } },
                tasks: { type: 'array', items: { type: 'string' } },
              },
              required: ['title', 'resources', 'tasks'],
            },
          },
        },
        required: ['week', 'topics'],
      },
    },
  },
  required: ['weeks'],
};

const interviewSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    confidenceScore: { type: 'integer', minimum: 0, maximum: 100 },
    weakAreas: { type: 'array', items: { type: 'string' } },
    suggestedResources: { type: 'array', items: { type: 'string' } },
    overallRating: { type: 'number', minimum: 0, maximum: 10 },
    comments: { type: 'string' },
  },
  required: ['confidenceScore', 'weakAreas', 'suggestedResources', 'overallRating', 'comments'],
};

const experienceSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    aiSummary: { type: 'string' },
    extractedQuestions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          question: { type: 'string' },
          topic: { type: 'string' },
          difficulty: { type: 'string' },
        },
        required: ['question', 'topic', 'difficulty'],
      },
    },
  },
  required: ['aiSummary', 'extractedQuestions'],
};

export const analyzeResume = async (resumeText) => {
  try {
    return await runJson(
      'resume_analysis',
      resumeSchema,
      'You are an expert ATS and career coach.',
      `Analyze this resume. Score ATS compatibility from 0 to 100, identify missing skills for common technology roles, and provide specific improvement suggestions. Resume:\n${resumeText}`,
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
      'placement_roadmap',
      roadmapSchema,
      'You are a career mentor creating a practical placement preparation roadmap.',
      `Generate a personalized week-by-week placement preparation roadmap. Branch: ${userData.branch || 'Not specified'}. Year: ${userData.year || 'Not specified'}. Target Companies: ${targetCompanies}. Available Hours/Day: ${userData.availableHoursPerDay || 'Not specified'}. Skill Level: ${userData.skillLevel || 'Not specified'}. Each topic must include a useful title, resources, and concrete tasks.`,
    );
  } catch (error) {
    logger.error('AI Roadmap Generation Error:', error);
    throw error;
  }
};

export const getInterviewFeedback = async (transcript) => {
  try {
    return await runJson(
      'interview_feedback',
      interviewSchema,
      'You are a technical interviewer evaluating an interview transcript.',
      `Evaluate this interview transcript. Give a confidence score, weak areas, suggested resources, an overall rating from 0 to 10, and detailed comments. Transcript:\n${transcript}`,
    );
  } catch (error) {
    logger.error('AI Interview Feedback Error:', error);
    throw error;
  }
};

export const summarizeExperience = async (experienceContent) => {
  try {
    return await runJson(
      'experience_summary',
      experienceSchema,
      'You summarize software interview experiences and extract useful questions.',
      `Summarize this interview experience and extract the interview questions with their topic and difficulty. Experience:\n${experienceContent}`,
    );
  } catch (error) {
    logger.error('AI Experience Summarization Error:', error);
    throw error;
  }
};
