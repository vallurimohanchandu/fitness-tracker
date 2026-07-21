import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database Connection Helper (Cached connection for serverless performance)
let isConnected = false;
async function connectToDB() {
  if (isConnected) return;
  const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_gym_planner';
  try {
    await mongoose.connect(dbUri);
    isConnected = true;
    console.log("MongoDB connection initialized successfully.");
  } catch (err) {
    console.error("Database connection failure:", err);
    throw err;
  }
}

// Authentication Middleware
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required. No token found.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_gym_planner_fallback_123');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token is invalid or has expired.' });
  }
};

// --- AUTH API ENDPOINTS ---

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  await connectToDB();
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Missing registration details.' });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email address already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      onboardingCompleted: false
    });

    await newUser.save();

    const token = jwt.sign(
      { uid: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || 'secret_key_gym_planner_fallback_123',
      { expiresIn: '30d' }
    );

    // Return the created profile data along with authentication token
    res.status(201).json({
      token,
      user: {
        uid: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        onboardingCompleted: false
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: 'Internal server error occurred.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  await connectToDB();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    const token = jwt.sign(
      { uid: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret_key_gym_planner_fallback_123',
      { expiresIn: '30d' }
    );

    res.status(200).json({
      token,
      user: {
        uid: user._id,
        fullName: user.fullName,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
        fitnessLevel: user.fitnessLevel,
        workoutDays: user.workoutDays,
        primaryGoal: user.primaryGoal,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        experienceLevel: user.experienceLevel,
        equipment: user.equipment,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Internal server error occurred.' });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  res.status(200).json({ message: 'Session logged out.' });
});

// --- PROFILE API ENDPOINTS ---

// GET /api/profile
app.get('/api/profile', authenticateUser, async (req, res) => {
  await connectToDB();
  try {
    const user = await User.findById(req.user.uid).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Profile not found.' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// POST /api/profile (Complete onboarding / Create profile statistics)
app.post('/api/profile', authenticateUser, async (req, res) => {
  await connectToDB();
  try {
    const user = await User.findById(req.user.uid);
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    const {
      name,
      fullName,
      experienceLevel,
      fitnessLevel,
      workoutDaysPerWeek,
      workoutDays,
      goal,
      primaryGoal,
      equipment,
      height,
      weight
    } = req.body;

    user.fullName = name || fullName || user.fullName;
    user.experienceLevel = experienceLevel || fitnessLevel || user.experienceLevel;
    user.fitnessLevel = experienceLevel || fitnessLevel || user.fitnessLevel;
    user.workoutDays = workoutDaysPerWeek || workoutDays || user.workoutDays;
    user.primaryGoal = goal || primaryGoal || user.primaryGoal;
    user.height = height || user.height;
    user.weight = weight || user.weight;
    user.equipment = equipment || user.equipment;
    user.onboardingCompleted = true;

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.error("Onboarding submission error:", err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// PUT /api/profile (Edit profile details from Profile page)
app.put('/api/profile', authenticateUser, async (req, res) => {
  await connectToDB();
  try {
    const user = await User.findById(req.user.uid);
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    const {
      name,
      fullName,
      experienceLevel,
      fitnessLevel,
      workoutDaysPerWeek,
      workoutDays,
      goal,
      primaryGoal,
      height,
      weight
    } = req.body;

    user.fullName = name || fullName || user.fullName;
    user.experienceLevel = experienceLevel || fitnessLevel || user.experienceLevel;
    user.fitnessLevel = experienceLevel || fitnessLevel || user.fitnessLevel;
    user.workoutDays = workoutDaysPerWeek || workoutDays || user.workoutDays;
    user.primaryGoal = goal || primaryGoal || user.primaryGoal;
    user.height = height || user.height;
    user.weight = weight || user.weight;

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.error("Profile edit error:", err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Mock forgot password endpoint for safety
app.post('/api/auth/forgot-password', async (req, res) => {
  await connectToDB();
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' });
    }
    // Success status
    res.status(200).json({ message: 'Reset email triggered successfully (Mocked).' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Start local server if run directly (Vite dev)
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Smart Gym Planner backend active on http://localhost:${port}`);
  });
}

export default app;
