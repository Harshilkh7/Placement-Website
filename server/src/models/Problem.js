import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  tags: [String],
  companyFrequency: [{
    companyName: String,
    frequency: Number
  }],
  constraints: String,
  inputFormat: String,
  outputFormat: String,
  sampleTestCases: [{
    input: String,
    output: String,
    explanation: String
  }],
  testCases: [{
    input: String,
    output: String,
    isPublic: { type: Boolean, default: false }
  }],
  solution: {
    javascript: String,
    python: String,
    cpp: String,
    java: String
  }
}, { timestamps: true });

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
