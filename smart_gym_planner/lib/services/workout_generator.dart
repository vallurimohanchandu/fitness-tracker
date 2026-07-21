import '../models/exercise_model.dart';
import '../models/user_model.dart';
import 'exercise_data.dart';

/// Generates a weekly workout plan based on user profile
class WorkoutGenerator {
  static WorkoutPlan generate(UserModel user) {
    final bool hasEquipment =
        !user.equipment.contains('none') && user.equipment.isNotEmpty;
    final splits = _getSplits(user.workoutDaysPerWeek);

    final days = List.generate(user.workoutDaysPerWeek, (i) {
      final split = splits[i];
      final exercises = _exercisesForSplit(
          split, user.equipment, user.experienceLevel, hasEquipment);
      return WorkoutDay(
        dayName: 'Day ${i + 1}',
        splitName: split,
        exercises: exercises,
        warmup: ExerciseData.warmupExercises,
        stretching: ExerciseData.stretchingExercises,
        cardio: ExerciseData.cardioExercises, // cardio every day
      );
    });

    return WorkoutPlan(days: days, generatedFor: user.experienceLevel);
  }

  /// Returns the correct split schedule for 5, 6, or 7 days
  static List<String> _getSplits(int days) {
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

  static List<ExerciseModel> _exercisesForSplit(
    String split,
    List<String> equipment,
    String level,
    bool hasEquipment,
  ) {
    final muscles = _musclesForSplit(split);

    var filtered = ExerciseData.allExercises.where((e) {
      if (!muscles.contains(e.muscleGroup)) return false;
      if (!hasEquipment) return e.requiredEquipment.isEmpty;
      if (e.requiredEquipment.isEmpty) return true;
      return e.requiredEquipment.any((eq) => equipment.contains(eq));
    }).where((e) {
      if (level == 'beginner') return e.difficulty == 'beginner';
      if (level == 'intermediate') return e.difficulty != 'expert';
      return true; // expert sees all
    }).toList();

    final count = level == 'beginner' ? 4 : (level == 'intermediate' ? 5 : 6);
    return filtered.take(count).toList();
  }

  static List<String> _musclesForSplit(String split) {
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
}
