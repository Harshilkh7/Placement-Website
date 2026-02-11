import mongoose from 'mongoose';

const interviewExperienceSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  rounds: [{
    roundName: String, // OA, Technical, HR, etc.
    content: String,
    questionsAsked: [String],
  }],
  preparationTips: String,
  difficultyRating: { type: Number, min: 1, max: 5 },
  offerStatus: { type: String, enum: ['Accepted', 'Rejected', 'Pending', 'N/A'] },
  isAnonymous: { type: Boolean, default: false },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  aiSummary: String,
  extractedQuestions: [{
    question: String,
    topic: String,
    difficulty: String
  }]
}, { timestamps: true });

const InterviewExperience = mongoose.model('InterviewExperience', interviewExperienceSchema);
export default InterviewExperience;
