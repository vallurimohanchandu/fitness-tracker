// ── Exercise & Workout Plan Models ───────────────────────────────────────────

/// A single exercise definition
class ExerciseModel {
  final String id;
  final String name;
  final String muscleGroup;
  final int sets;
  final String reps;         // e.g. "8-12" or "30 sec"
  final String instructions;
  final String imageUrl;
  final List<String> requiredEquipment; // empty = bodyweight
  final String difficulty;   // beginner | intermediate | expert

  const ExerciseModel({
    required this.id,
    required this.name,
    required this.muscleGroup,
    required this.sets,
    required this.reps,
    required this.instructions,
    required this.imageUrl,
    required this.requiredEquipment,
    required this.difficulty,
  });
}

/// One day in the weekly plan
class WorkoutDay {
  final String dayName;
  final String splitName;
  final List<ExerciseModel> exercises;
  final List<ExerciseModel> warmup;
  final List<ExerciseModel> stretching;
  final List<ExerciseModel> cardio;
  bool isCompleted;

  WorkoutDay({
    required this.dayName,
    required this.splitName,
    required this.exercises,
    required this.warmup,
    required this.stretching,
    this.cardio = const [],
    this.isCompleted = false,
  });

  /// Total sets across all main exercises
  int get totalSets => exercises.fold(0, (s, e) => s + e.sets);

  /// Rough calorie burn estimate
  int get estimatedCalories => (exercises.length * totalSets * 8) + 120; // +120 for cardio
}

/// Full weekly workout plan
class WorkoutPlan {
  final List<WorkoutDay> days;
  final String generatedFor; // experience level

  const WorkoutPlan({required this.days, required this.generatedFor});
}
