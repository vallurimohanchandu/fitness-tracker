import { allExercises, warmupExercises, stretchingExercises, cardioExercises } from '../data/exerciseData';

export function generateWorkoutPlan(user) {
  const hasEquipment = user.equipment && !user.equipment.includes('none') && user.equipment.length > 0;
  const splits = getSplitsForDays(user.workoutDaysPerWeek);

  const days = Array.from({ length: user.workoutDaysPerWeek }, (_, i) => {
    const split = splits[i];
    const exercises = getExercisesForSplit(split, user.equipment || [], user.experienceLevel, hasEquipment);
    
    // Calculate total sets across main exercises
    const totalSets = exercises.reduce((sum, e) => sum + e.sets, 0);
    // Rough calorie burn estimate: (exercises * sets * 8) + 120 (cardio/warmup)
    const estimatedCalories = (exercises.length * totalSets * 8) + 120;

    return {
      dayName: `Day ${i + 1}`,
      splitName: split,
      exercises,
      warmup: warmupExercises,
      stretching: stretchingExercises,
      cardio: cardioExercises,
      isCompleted: false,
      estimatedCalories,
    };
  });

  return {
    days,
    generatedFor: user.experienceLevel,
  };
}

function getSplitsForDays(days) {
  switch (days) {
    case 5:
      return [
        'Chest + Triceps',
        'Back + Biceps',
        'Legs',
        'Shoulders + Core',
        'Full Body',
      ];
    case 6:
      return [
        'Chest + Triceps',
        'Back + Biceps',
        'Shoulders + Forearms',
        'Chest + Triceps',
        'Back + Biceps',
        'Legs + Shoulders',
      ];
    case 7:
    default:
      return [
        'Chest + Triceps',
        'Back + Biceps',
        'Legs + Shoulders',
        'Shoulders + Forearms',
        'Chest + Triceps',
        'Back + Biceps',
        'Legs + Shoulders',
      ];
  }
}

function getExercisesForSplit(split, equipmentList, level, hasEquipment) {
  const muscles = getMusclesForSplit(split);

  const filtered = allExercises.filter(e => {
    // Check muscle group
    if (!muscles.includes(e.muscleGroup)) return false;
    
    // Check equipment
    if (!hasEquipment) {
      return e.requiredEquipment.length === 0;
    }
    if (e.requiredEquipment.length === 0) return true;
    return e.requiredEquipment.some(eq => equipmentList.includes(eq));
  }).filter(e => {
    // Check difficulty level
    if (level === 'beginner') return e.difficulty === 'beginner';
    if (level === 'intermediate') return e.difficulty !== 'expert';
    return true; // expert sees all
  });

  const count = level === 'beginner' ? 4 : (level === 'intermediate' ? 5 : 6);
  return filtered.slice(0, count);
}

function getMusclesForSplit(split) {
  switch (split) {
    case 'Chest + Triceps':
      return ['chest', 'triceps'];
    case 'Back + Biceps':
      return ['back', 'biceps'];
    case 'Legs':
      return ['legs'];
    case 'Legs + Shoulders':
      return ['legs', 'shoulders'];
    case 'Shoulders + Forearms':
      return ['shoulders', 'forearms'];
    case 'Shoulders + Core':
      return ['shoulders', 'core'];
    case 'Full Body':
      return ['chest', 'back', 'legs', 'shoulders'];
    default:
      return [];
  }
}
