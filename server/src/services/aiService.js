import OpenAI from 'openai';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    logger.warn('OpenAI API Key is missing or default. AI features will not work.');
    return null;
  }
  return new OpenAI({ apiKey });
};

const openai = getOpenAIClient();

export const analyzeResume = async (resumeText) => {
  try {
    if (!openai) throw new Error('AI service not configured');
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS (Applicant Tracking System) and career coach. Analyze the provided resume text."
        },
        {
          role: "user",
          content: `Analyze this resume and provide: 1. ATS compatibility score (0-100), 2. Missing skills for common tech roles, 3. Specific improvement suggestions. Format as JSON.
          
          Resume Text: ${resumeText}`
        }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    logger.error('AI Resume Analysis Error:', error);
    throw error;
  }
};

export const generateRoadmap = async (userData) => {
  try {
    if (!openai) throw new Error('AI service not configured');
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a career mentor. Generate a personalized placement preparation roadmap."
        },
        {
          role: "user",
          content: `Generate a week-by-week study plan for a student with these details: 
          Branch: ${userData.branch}, Year: ${userData.year}, Target Companies: ${userData.targetCompanies.join(', ')}, 
          Available Hours/Day: ${userData.availableHoursPerDay}, Skill Level: ${userData.skillLevel}.
          Format as JSON with an array of weeks, each containing topics with title, resources, and tasks.`
        }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    logger.error('AI Roadmap Generation Error:', error);
    throw error;
  }
};

export const getInterviewFeedback = async (transcript) => {
  try {
    if (!openai) throw new Error('AI service not configured');
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a technical interviewer. Evaluate the following interview transcript."
        },
        {
          role: "user",
          content: `Evaluate this interview transcript: ${JSON.stringify(transcript)}. 
          Provide: 1. Confidence score (0-100), 2. Weak areas, 3. Suggested resources, 4. Overall rating (0-10), 5. Detailed AI comments. 
          Format as JSON.`
        }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    logger.error('AI Interview Feedback Error:', error);
    throw error;
  }
};

export const summarizeExperience = async (experienceContent) => {
  try {
    if (!openai) throw new Error('AI service not configured');
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Summarize interview experiences and extract key questions."
        },
        {
          role: "user",
          content: `Summarize this interview experience and extract questions with their topics and difficulty: ${experienceContent}. 
          Format as JSON with aiSummary and extractedQuestions (array of {question, topic, difficulty}).`
        }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    logger.error('AI Experience Summarization Error:', error);
    throw error;
  }
};
