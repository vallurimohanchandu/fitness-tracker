import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  onboardingCompleted: { type: Boolean, default: false },
  fitnessLevel: { type: String, default: 'beginner' },
  workoutDays: { type: Number, default: 5 },
  primaryGoal: { type: String, default: 'muscle_gain' },
  age: { type: Number, default: 25 },
  gender: { type: String, default: 'male' },
  height: { type: Number, default: 170 },
  weight: { type: Number, default: 70 },
  experienceLevel: { type: String, default: 'beginner' },
  equipment: { type: [String], default: ['none'] },
  profileImage: { type: String, default: '' }
}, { timestamps: true });

// Prevent compilation error if model already compiled
export default mongoose.models.User || mongoose.model('User', UserSchema);
