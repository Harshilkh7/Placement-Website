import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetCompanies: [String],
  branch: String,
  year: String,
  availableHoursPerDay: Number,
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  plan: [{
    week: Number,
    topics: [{
      title: String,
      isCompleted: { type: Boolean, default: false },
      resources: [String],
      tasks: [String]
    }]
  }],
  status: { type: String, enum: ['Active', 'Completed', 'Paused'], default: 'Active' }
}, { timestamps: true });

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;
