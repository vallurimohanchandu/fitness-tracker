// ── Calorie & Nutrition Models ────────────────────────────────────────────────

/// Macronutrient breakdown for a food item
class Macros {
  final double protein; // grams
  final double carbs;   // grams
  final double fat;     // grams
  final double fiber;   // grams

  const Macros({
    this.protein = 0,
    this.carbs = 0,
    this.fat = 0,
    this.fiber = 0,
  });

  Macros operator +(Macros other) => Macros(
        protein: protein + other.protein,
        carbs: carbs + other.carbs,
        fat: fat + other.fat,
        fiber: fiber + other.fiber,
      );

  Map<String, dynamic> toJson() => {
        'protein': protein,
        'carbs': carbs,
        'fat': fat,
        'fiber': fiber,
      };

  factory Macros.fromJson(Map<String, dynamic> j) => Macros(
        protein: (j['protein'] ?? 0).toDouble(),
        carbs: (j['carbs'] ?? 0).toDouble(),
        fat: (j['fat'] ?? 0).toDouble(),
        fiber: (j['fiber'] ?? 0).toDouble(),
      );
}

/// A food item in the predefined Indian food database
class FoodItem {
  final String name;
  final int caloriesPer100g;
  final Macros macrosPer100g;
  final String emoji;
  /// Human-readable unit label shown to user (e.g. "roti", "katori", "egg")
  final String servingUnit;
  /// How many grams 1 serving equals (used for calorie calculation)
  final double gramsPerServing;

  const FoodItem({
    required this.name,
    required this.caloriesPer100g,
    required this.macrosPer100g,
    this.emoji = '🍽️',
    this.servingUnit = 'serving (100g)',
    this.gramsPerServing = 100,
  });

  /// Calories for a given number of servings
  int caloriesForServings(double qty) =>
      (caloriesPer100g * gramsPerServing * qty / 100).round();

  /// Macros for a given number of servings
  Macros macrosForServings(double qty) {
    final ratio = gramsPerServing * qty / 100;
    return Macros(
      protein: macrosPer100g.protein * ratio,
      carbs: macrosPer100g.carbs * ratio,
      fat: macrosPer100g.fat * ratio,
      fiber: macrosPer100g.fiber * ratio,
    );
  }
}

/// A single logged food entry
class FoodEntry {
  final String id;
  final String name;
  final int calories;
  final Macros macros;
  final DateTime timestamp;

  const FoodEntry({
    required this.id,
    required this.name,
    required this.calories,
    required this.macros,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'calories': calories,
        'macros': macros.toJson(),
        'timestamp': timestamp.toIso8601String(),
      };

  factory FoodEntry.fromJson(Map<String, dynamic> j) => FoodEntry(
        id: j['id'],
        name: j['name'],
        calories: j['calories'],
        macros: j['macros'] != null
            ? Macros.fromJson(j['macros'])
            : const Macros(),
        timestamp: DateTime.parse(j['timestamp']),
      );
}

/// Daily calorie + macro summary
class DailyCalorieSummary {
  final DateTime date;
  final int caloriesIn;
  final int caloriesBurned;

  const DailyCalorieSummary({
    required this.date,
    required this.caloriesIn,
    required this.caloriesBurned,
  });

  int get netCalories => caloriesIn - caloriesBurned;
}

/// Daily nutrition targets based on BMI + goal
class NutritionTarget {
  final int calories;
  final double protein; // g
  final double carbs;   // g
  final double fat;     // g

  const NutritionTarget({
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.fat,
  });

  /// Calculate targets from weight (kg), height (cm), age, goal
  factory NutritionTarget.calculate({
    required double weight,
    required double height,
    required String goal, // fat_loss | muscle_gain | maintain
  }) {
    // Mifflin-St Jeor BMR (assuming moderate activity)
    final bmr = (10 * weight) + (6.25 * height) - (5 * 25) + 5;
    final tdee = bmr * 1.55; // moderate activity multiplier

    int calories;
    if (goal == 'fat_loss') {
      calories = (tdee - 400).round();
    } else if (goal == 'muscle_gain') {
      calories = (tdee + 300).round();
    } else {
      calories = tdee.round();
    }

    // Protein: 1.8g/kg for muscle gain, 1.6g/kg otherwise
    final protein = weight * (goal == 'muscle_gain' ? 1.8 : 1.6);
    // Fat: 25% of calories
    final fat = (calories * 0.25) / 9;
    // Carbs: remaining calories
    final carbCals = calories - (protein * 4) - (fat * 9);
    final carbs = carbCals / 4;

    return NutritionTarget(
      calories: calories,
      protein: protein,
      carbs: carbs.clamp(0, 500),
      fat: fat,
    );
  }
}
