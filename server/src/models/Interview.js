import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['HR', 'DSA', 'Core CS', 'System Design'], required: true },
  status: { type: String, enum: ['Scheduled', 'In-Progress', 'Completed'], default: 'Scheduled' },
  transcript: [{
    role: { type: String, enum: ['AI', 'User'] },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  feedback: {
    confidenceScore: Number,
    weakAreas: [String],
    suggestedResources: [String],
    overallRating: Number,
    aiComments: String
  }
}, { timestamps: true });

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
