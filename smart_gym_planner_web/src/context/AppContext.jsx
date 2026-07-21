import React, { createContext, useState, useEffect, useContext } from 'react';
import { generateWorkoutPlan } from '../utils/workoutGenerator';
import { auth, db, googleProvider } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

const AppContext = createContext();

export function AppProvider({ children }) {
  // ── FIREBASE AUTH STATE ──────────────────────────────────────────────────
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ── USER STATE ───────────────────────────────────────────────────────────
  const [user, setUserState] = useState(() => {
    const raw = localStorage.getItem('sg_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [onboardingDone, setOnboardingDone] = useState(() => {
    return localStorage.getItem('sg_onboarding_done') === 'true';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isFirebaseAvailable = auth !== null;

  // ── FIREBASE AUTH OBSERVER ───────────────────────────────────────────────
  useEffect(() => {
    if (!isFirebaseAvailable) {
      // In Local Mode, load user from local storage
      const rawUser = localStorage.getItem('sg_user');
      if (rawUser) {
        setUserState(JSON.parse(rawUser));
        setIsLoggedIn(true);
        setOnboardingDone(localStorage.getItem('sg_onboarding_done') === 'true');
        
        const savedPlan = localStorage.getItem('sg_workout_plan');
        if (savedPlan) {
          setWorkoutPlan(JSON.parse(savedPlan));
        }
      }
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      if (fUser) {
        setFirebaseUser(fUser);
        setIsLoggedIn(true);
        // Fetch Firestore user doc
        try {
          const userDocRef = doc(db, 'users', fUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserState(userData);
            setOnboardingDone(true);
            
            // Load workout plan
            const savedPlan = localStorage.getItem('sg_workout_plan');
            if (savedPlan) {
              setWorkoutPlan(JSON.parse(savedPlan));
            } else {
              const plan = generateWorkoutPlan(userData);
              setWorkoutPlan(plan);
              localStorage.setItem('sg_workout_plan', JSON.stringify(plan));
            }
          } else {
            // Authenticated but onboarding not complete
            setUserState(null);
            setOnboardingDone(false);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setFirebaseUser(null);
        setUserState(null);
        setOnboardingDone(false);
        setIsLoggedIn(false);
        setWorkoutPlan(null);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    const raw = localStorage.getItem('sg_unlocked_achievements');
    return raw ? JSON.parse(raw) : [];
  });
  const [currentStreak, setCurrentStreak] = useState(() => {
    const raw = localStorage.getItem('sg_current_streak');
    return raw ? parseInt(raw) : 0;
  });
  const [lastActiveDate, setLastActiveDate] = useState(() => {
    return localStorage.getItem('sg_last_active_date') || '';
  });
  const [achievementToast, setAchievementToast] = useState({ show: false, title: '', icon: '' });

  // Logged sets: { "dayIdx_exerciseId": [ { weight, reps, isCompleted } ] }
  const [loggedSets, setLoggedSets] = useState(() => {
    const raw = localStorage.getItem('sg_logged_sets');
    return raw ? JSON.parse(raw) : {};
  });


  // Calculate BMI and Targets dynamically
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('Unknown');
  const [nutritionTarget, setNutritionTarget] = useState({
    calories: 2000,
    protein: 100,
    carbs: 200,
    fat: 65,
  });

  useEffect(() => {
    if (user && user.weight && user.height) {
      const hM = user.height / 100;
      const b = user.weight / (hM * hM);
      setBmi(Math.round(b * 10) / 10);

      let cat = 'Unknown';
      if (b < 18.5) cat = 'Underweight';
      else if (b < 25.0) cat = 'Normal';
      else if (b < 30.0) cat = 'Overweight';
      else cat = 'Obese';
      setBmiCategory(cat);

      // Mifflin-St Jeor calculation (assuming age 25 for general)
      const bmr = (10 * user.weight) + (6.25 * user.height) - (5 * 25) + 5;
      const tdee = bmr * 1.55;

      let c = Math.round(tdee);
      if (user.goal === 'fat_loss') c = Math.round(tdee - 400);
      else if (user.goal === 'muscle_gain') c = Math.round(tdee + 300);

      const p = Math.round(user.weight * (user.goal === 'muscle_gain' ? 1.8 : 1.6));
      const f = Math.round((c * 0.25) / 9);
      const carbsCal = c - (p * 4) - (f * 9);
      const cb = Math.round(Math.max(0, carbsCal / 4));

      setNutritionTarget({
        calories: c,
        protein: p,
        carbs: cb,
        fat: f,
      });
    }
  }, [user]);

  const unlockAchievement = (id) => {
    if (unlockedAchievements.includes(id)) return;

    const achievementsList = [
      { id: 'first_step', title: 'First Step', icon: '🚀' },
      { id: 'iron_lifter', title: 'Iron Lifter', icon: '🦵' },
      { id: 'macro_master', title: 'Macro Master', icon: '🎯' },
      { id: 'consistent_tracker', title: 'Streak Starter', icon: '🔥' },
      { id: 'notes_warrior', title: 'Mindful Tracker', icon: '📝' }
    ];

    const ach = achievementsList.find(a => a.id === id);
    if (!ach) return;

    const updated = [...unlockedAchievements, id];
    setUnlockedAchievements(updated);
    localStorage.setItem('sg_unlocked_achievements', JSON.stringify(updated));

    // Trigger visual toast
    setAchievementToast({ show: true, title: ach.title, icon: ach.icon });
    setTimeout(() => {
      setAchievementToast({ show: false, title: '', icon: '' });
    }, 4000);
  };

  const updateStreak = () => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    if (lastActiveDate === todayStr) return;

    let nextStreak = 1;
    if (lastActiveDate) {
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
      if (lastActiveDate === yesterdayStr) {
        nextStreak = currentStreak + 1;
      }
    }

    setCurrentStreak(nextStreak);
    setLastActiveDate(todayStr);
    localStorage.setItem('sg_current_streak', nextStreak.toString());
    localStorage.setItem('sg_last_active_date', todayStr);

    if (nextStreak >= 3) {
      unlockAchievement('consistent_tracker');
    }
  };

  const updateSetLog = (dayIdx, exerciseId, setIdx, field, value) => {
    const key = `${dayIdx}_${exerciseId}`;
    const currentList = loggedSets[key] ? [...loggedSets[key]] : [];
    
    while (currentList.length <= setIdx) {
      currentList.push({ weight: '', reps: '', isCompleted: false });
    }

    currentList[setIdx] = {
      ...currentList[setIdx],
      [field]: field === 'isCompleted' ? value : value.toString()
    };

    const updated = {
      ...loggedSets,
      [key]: currentList
    };

    setLoggedSets(updated);
    localStorage.setItem('sg_logged_sets', JSON.stringify(updated));
  };

  const saveUser = async (userData) => {
    if (isFirebaseAvailable && auth.currentUser) {
      const uid = auth.currentUser.uid;
      const userProfile = {
        uid,
        fullName: userData.name || auth.currentUser.displayName || 'Athlete',
        email: auth.currentUser.email || '',
        profileImage: auth.currentUser.photoURL || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...userData
      };

      try {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, userProfile);

        setUserState(userProfile);
        localStorage.setItem('sg_user', JSON.stringify(userProfile));
        localStorage.setItem('sg_onboarding_done', 'true');
        setOnboardingDone(true);
        setIsLoggedIn(true);

        const plan = generateWorkoutPlan(userProfile);
        setWorkoutPlan(plan);
        localStorage.setItem('sg_workout_plan', JSON.stringify(plan));

        setTimeout(() => {
          unlockAchievement('first_step');
        }, 1500);
      } catch (err) {
        console.error("Error saving user profile:", err);
        throw err;
      }
    } else {
      // Local Mode Fallback
      setUserState(userData);
      localStorage.setItem('sg_user', JSON.stringify(userData));
      localStorage.setItem('sg_onboarding_done', 'true');
      setOnboardingDone(true);
      setIsLoggedIn(true);

      const plan = generateWorkoutPlan(userData);
      setWorkoutPlan(plan);
      localStorage.setItem('sg_workout_plan', JSON.stringify(plan));

      setTimeout(() => {
        unlockAchievement('first_step');
      }, 1500);
    }
  };

  const signUpWithEmail = async (email, password, fullName) => {
    if (isFirebaseAvailable) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fUser = userCredential.user;

      const baseProfile = {
        uid: fUser.uid,
        fullName,
        email,
        profileImage: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const userDocRef = doc(db, 'users', fUser.uid);
      await setDoc(userDocRef, baseProfile);
      return fUser;
    } else {
      // Local Mode Fallback: save to localStorage credentials list
      const baseProfile = {
        uid: 'local_' + new Date().getTime(),
        fullName,
        email,
        password, // save password for local verify
        profileImage: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const rawAccounts = localStorage.getItem('sg_local_accounts');
      const accounts = rawAccounts ? JSON.parse(rawAccounts) : [];

      if (accounts.some(acc => acc.email.toLowerCase() === email.toLowerCase())) {
        const err = new Error("This email is already registered.");
        err.code = 'auth/email-already-in-use';
        throw err;
      }

      accounts.push(baseProfile);
      localStorage.setItem('sg_local_accounts', JSON.stringify(accounts));

      setUserState(baseProfile);
      localStorage.setItem('sg_user', JSON.stringify(baseProfile));
      setOnboardingDone(false);
      setIsLoggedIn(true);
      return baseProfile;
    }
  };

  const loginWithEmail = async (email, password) => {
    if (isFirebaseAvailable) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } else {
      const rawAccounts = localStorage.getItem('sg_local_accounts');
      const accounts = rawAccounts ? JSON.parse(rawAccounts) : [];
      const match = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password);
      if (!match) {
        const err = new Error("Invalid email or password.");
        err.code = 'auth/invalid-credential';
        throw err;
      }

      setUserState(match);
      localStorage.setItem('sg_user', JSON.stringify(match));
      localStorage.setItem('sg_onboarding_done', match.weight ? 'true' : 'false');
      setOnboardingDone(match.weight ? true : false);
      setIsLoggedIn(true);

      const savedPlan = localStorage.getItem('sg_workout_plan');
      if (savedPlan) {
        setWorkoutPlan(JSON.parse(savedPlan));
      }
      return match;
    }
  };

  const loginWithGoogle = async () => {
    if (isFirebaseAvailable) {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const fUser = userCredential.user;

      const userDocRef = doc(db, 'users', fUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        const baseProfile = {
          uid: fUser.uid,
          fullName: fUser.displayName || 'Athlete',
          email: fUser.email || '',
          profileImage: fUser.photoURL || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userDocRef, baseProfile);
      }
      return fUser;
    } else {
      const localGoogleUser = {
        uid: 'local_google_' + new Date().getTime(),
        fullName: 'Google Athlete',
        email: 'athlete@gmail.com',
        profileImage: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUserState(localGoogleUser);
      localStorage.setItem('sg_user', JSON.stringify(localGoogleUser));
      setOnboardingDone(false);
      setIsLoggedIn(true);
      return localGoogleUser;
    }
  };

  const sendPasswordReset = async (email) => {
    if (isFirebaseAvailable) {
      await sendPasswordResetEmail(auth, email);
    } else {
      const rawAccounts = localStorage.getItem('sg_local_accounts');
      const accounts = rawAccounts ? JSON.parse(rawAccounts) : [];
      if (!accounts.some(acc => acc.email.toLowerCase() === email.toLowerCase())) {
        const err = new Error("No account found with this email.");
        err.code = 'auth/user-not-found';
        throw err;
      }
      return true;
    }
  };

  const logout = () => {
    setUserState(null);
    setOnboardingDone(false);
    setIsLoggedIn(false);
    setWorkoutPlan(null);
    setWeightEntries([]);
    setFoodEntries([]);
    setUnlockedAchievements([]);
    setCurrentStreak(0);
    setLastActiveDate('');
    setLoggedSets({});
    localStorage.removeItem('sg_user');
    localStorage.removeItem('sg_onboarding_done');
    localStorage.removeItem('sg_workout_plan');
    localStorage.removeItem('sg_weight_entries');
    localStorage.removeItem('sg_food_entries');
    localStorage.removeItem('sg_unlocked_achievements');
    localStorage.removeItem('sg_current_streak');
    localStorage.removeItem('sg_last_active_date');
    localStorage.removeItem('sg_logged_sets');
  };

  const logOutUser = async () => {
    if (isFirebaseAvailable && auth) {
      await signOut(auth);
    }
    logout();
  };

  // ── WORKOUT PLAN STATE ───────────────────────────────────────────────────
  const [workoutPlan, setWorkoutPlan] = useState(() => {
    const raw = localStorage.getItem('sg_workout_plan');
    return raw ? JSON.parse(raw) : null;
  });

  const markDayCompleted = (index) => {
    if (!workoutPlan) return;
    const updatedDays = workoutPlan.days.map((day, i) => {
      if (i === index) return { ...day, isCompleted: true };
      return day;
    });
    const updatedPlan = { ...workoutPlan, days: updatedDays };
    setWorkoutPlan(updatedPlan);
    localStorage.setItem('sg_workout_plan', JSON.stringify(updatedPlan));

    // Check achievement for leg day
    const completedDay = workoutPlan.days[index];
    const hasLegs = completedDay.splitName.toLowerCase().includes('legs') ||
                    completedDay.exercises.some(e => e.muscleGroup === 'legs');
    if (hasLegs) {
      unlockAchievement('iron_lifter');
    }
    updateStreak();
  };

  const resetWorkoutPlan = () => {
    if (!user) return;
    const plan = generateWorkoutPlan(user);
    setWorkoutPlan(plan);
    localStorage.setItem('sg_workout_plan', JSON.stringify(plan));
  };

  const caloriesBurnedToday = workoutPlan
    ? workoutPlan.days
        .filter(d => d.isCompleted)
        .reduce((sum, d) => sum + d.estimatedCalories, 0)
    : 0;

  // ── WEIGHT TRACKER STATE ─────────────────────────────────────────────────
  const [weightEntries, setWeightEntries] = useState(() => {
    const raw = localStorage.getItem('sg_weight_entries');
    return raw ? JSON.parse(raw) : [];
  });

  const addWeightEntry = (weight, note = '') => {
    const now = new Date();
    // Remove duplicate entry for today if any
    const filtered = weightEntries.filter(e => {
      const d = new Date(e.date);
      return !(d.getFullYear() === now.getFullYear() &&
               d.getMonth() === now.getMonth() &&
               d.getDate() === now.getDate());
    });

    const newEntry = {
      id: now.getTime().toString(),
      weight: parseFloat(weight),
      date: now.toISOString(),
      note,
    };

    const updated = [...filtered, newEntry];
    setWeightEntries(updated);
    localStorage.setItem('sg_weight_entries', JSON.stringify(updated));

    // Update weight in user profile as latest weight
    if (user) {
      const updatedUser = { ...user, weight: parseFloat(weight) };
      setUserState(updatedUser);
      localStorage.setItem('sg_user', JSON.stringify(updatedUser));
    }

    if (note && note.trim().length > 0) {
      unlockAchievement('notes_warrior');
    }
    updateStreak();
  };

  const removeWeightEntry = (id) => {
    const updated = weightEntries.filter(e => e.id !== id);
    setWeightEntries(updated);
    localStorage.setItem('sg_weight_entries', JSON.stringify(updated));
  };

  // Sorted oldest to newest for charts
  const sortedWeightEntries = [...weightEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
  const latestWeight = sortedWeightEntries.length > 0 ? sortedWeightEntries[sortedWeightEntries.length - 1] : null;
  const earliestWeight = sortedWeightEntries.length > 0 ? sortedWeightEntries[0] : null;
  const totalWeightChange = (latestWeight && earliestWeight) ? latestWeight.weight - earliestWeight.weight : null;

  const loggedWeightToday = weightEntries.some(e => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() &&
           d.getMonth() === now.getMonth() &&
           d.getDate() === now.getDate();
  });

  // ── CALORIE TRACKER STATE ────────────────────────────────────────────────
  const [foodEntries, setFoodEntries] = useState(() => {
    const raw = localStorage.getItem('sg_food_entries');
    return raw ? JSON.parse(raw) : [];
  });

  const addFoodEntry = (name, calories, macros) => {
    const newEntry = {
      id: new Date().getTime().toString(),
      name,
      calories: parseInt(calories),
      macros: {
        protein: parseFloat(macros.protein || 0),
        carbs: parseFloat(macros.carbs || 0),
        fat: parseFloat(macros.fat || 0),
        fiber: parseFloat(macros.fiber || 0),
      },
      timestamp: new Date().toISOString(),
    };
    const updated = [...foodEntries, newEntry];
    setFoodEntries(updated);
    localStorage.setItem('sg_food_entries', JSON.stringify(updated));

    updateStreak();
  };

  const removeFoodEntry = (id) => {
    const updated = foodEntries.filter(e => e.id !== id);
    setFoodEntries(updated);
    localStorage.setItem('sg_food_entries', JSON.stringify(updated));
  };

  // Calories / macros consumed today
  const [caloriesConsumedToday, setCaloriesConsumedToday] = useState(0);
  const [macrosConsumedToday, setMacrosConsumedToday] = useState({ protein: 0, carbs: 0, fat: 0, fiber: 0 });

  useEffect(() => {
    const now = new Date();
    const todayEntries = foodEntries.filter(e => {
      const d = new Date(e.timestamp);
      return d.getFullYear() === now.getFullYear() &&
             d.getMonth() === now.getMonth() &&
             d.getDate() === now.getDate();
    });

    const calSum = todayEntries.reduce((sum, e) => sum + e.calories, 0);
    const macroSum = todayEntries.reduce((acc, e) => {
      return {
        protein: acc.protein + e.macros.protein,
        carbs: acc.carbs + e.macros.carbs,
        fat: acc.fat + e.macros.fat,
        fiber: acc.fiber + e.macros.fiber,
      };
    }, { protein: 0, carbs: 0, fat: 0, fiber: 0 });

    // Round macros
    macroSum.protein = Math.round(macroSum.protein * 10) / 10;
    macroSum.carbs = Math.round(macroSum.carbs * 10) / 10;
    macroSum.fat = Math.round(macroSum.fat * 10) / 10;
    macroSum.fiber = Math.round(macroSum.fiber * 10) / 10;

    setCaloriesConsumedToday(calSum);
    setMacrosConsumedToday(macroSum);
  }, [foodEntries]);

  // Generate 7-day calorie history
  const [calorieHistory, setCalorieHistory] = useState([]);

  useEffect(() => {
    const now = new Date();
    const history = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(now.getDate() - i);
      
      const dayEntries = foodEntries.filter(e => {
        const d = new Date(e.timestamp);
        return d.getFullYear() === day.getFullYear() &&
               d.getMonth() === day.getMonth() &&
               d.getDate() === day.getDate();
      });

      const dayCal = dayEntries.reduce((sum, e) => sum + e.calories, 0);

      // Check if workout was completed on this day (simulate for history)
      // For simplicity, we just use today's completed calories or 0
      let dayBurned = 0;
      if (i === 0) {
        dayBurned = caloriesBurnedToday;
      }

      history.push({
        date: day.toISOString(),
        dayLabel: day.toLocaleDateString('en-US', { weekday: 'short' }),
        caloriesIn: dayCal,
        caloriesBurned: dayBurned,
      });
    }

    setCalorieHistory(history);
  }, [foodEntries, caloriesBurnedToday]);

  useEffect(() => {
    if (caloriesConsumedToday > 0 && nutritionTarget.calories > 0) {
      const diff = Math.abs(caloriesConsumedToday - nutritionTarget.calories);
      const percentDiff = (diff / nutritionTarget.calories) * 100;
      if (percentDiff <= 5) {
        unlockAchievement('macro_master');
      }
    }
  }, [caloriesConsumedToday, nutritionTarget.calories]);

  return (
    <AppContext.Provider
      value={{
        // User Profile
        user,
        onboardingDone,
        isLoggedIn,
        setIsLoggedIn,
        isFirebaseAvailable,
        authLoading,
        firebaseUser,
        signUpWithEmail,
        loginWithEmail,
        loginWithGoogle,
        sendPasswordReset,
        saveUser,
        logout,
        logOutUser,
        bmi,
        bmiCategory,
        nutritionTarget,

        // Achievements & Streaks
        unlockedAchievements,
        currentStreak,
        achievementToast,
        unlockAchievement,

        // Workout
        workoutPlan,
        caloriesBurnedToday,
        markDayCompleted,
        resetWorkoutPlan,
        loggedSets,
        updateSetLog,

        // Weight
        weightEntries,
        sortedWeightEntries,
        latestWeight,
        earliestWeight,
        totalWeightChange,
        loggedWeightToday,
        addWeightEntry,
        removeWeightEntry,

        // Calorie Tracker
        foodEntries,
        caloriesConsumedToday,
        macrosConsumedToday,
        calorieHistory,
        addFoodEntry,
        removeFoodEntry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
