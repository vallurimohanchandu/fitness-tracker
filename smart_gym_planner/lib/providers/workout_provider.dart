import 'package:flutter/material.dart';
import '../models/exercise_model.dart';
import '../models/user_model.dart';
import '../services/workout_generator.dart';

class WorkoutProvider extends ChangeNotifier {
  WorkoutPlan? _plan;
  WorkoutPlan? get plan => _plan;

  int get caloriesBurnedToday {
    if (_plan == null) return 0;
    return _plan!.days
        .where((d) => d.isCompleted)
        .fold(0, (sum, d) => sum + d.estimatedCalories);
  }

  void generatePlan(UserModel user) {
    _plan = WorkoutGenerator.generate(user);
    notifyListeners();
  }

  void markDayCompleted(int index) {
    if (_plan == null || index >= _plan!.days.length) return;
    _plan!.days[index].isCompleted = true;
    notifyListeners();
  }

  // Returns the first incomplete day, or last day if all done
  WorkoutDay? get todayWorkout {
    if (_plan == null) return null;
    try {
      return _plan!.days.firstWhere((d) => !d.isCompleted);
    } catch (_) {
      return _plan!.days.isNotEmpty ? _plan!.days.last : null;
    }
  }
}
