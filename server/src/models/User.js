import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'admin', 'recruiter', 'senior'],
    default: 'student'
  },
  profile: {
    skills: [String],
    targetCompanies: [String],
    resumeUrl: String,
    readinessScore: { type: Number, default: 0 },
    bio: String,
    socialLinks: {
      github: String,
      linkedin: String
    }
  },
  refreshToken: String,
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
