import '../models/calorie_model.dart';

/// Indian food database — each item has a serving unit and serving size
/// so users pick quantity (1 roti, 2 eggs, 150g rice) instead of raw grams
class FoodData {
  static const List<FoodItem> items = [

    // ── Grains & Staples ──────────────────────────────────────────────────
    FoodItem(
      name: 'Roti (wheat)',
      emoji: '🫓',
      servingUnit: 'roti',
      gramsPerServing: 40, // 1 medium roti ≈ 40g
      caloriesPer100g: 297,
      macrosPer100g: Macros(protein: 9, carbs: 55, fat: 3.7, fiber: 2.7),
    ),
    FoodItem(
      name: 'Paratha (plain)',
      emoji: '🫓',
      servingUnit: 'paratha',
      gramsPerServing: 80,
      caloriesPer100g: 326,
      macrosPer100g: Macros(protein: 8, carbs: 50, fat: 11, fiber: 2.5),
    ),
    FoodItem(
      name: 'Rice (cooked)',
      emoji: '🍚',
      servingUnit: 'katori',
      gramsPerServing: 150, // 1 katori ≈ 150g cooked
      caloriesPer100g: 130,
      macrosPer100g: Macros(protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4),
    ),
    FoodItem(
      name: 'Idli',
      emoji: '🍚',
      servingUnit: 'piece',
      gramsPerServing: 40,
      caloriesPer100g: 58,
      macrosPer100g: Macros(protein: 2, carbs: 12, fat: 0.1, fiber: 0.5),
    ),
    FoodItem(
      name: 'Dosa',
      emoji: '🥞',
      servingUnit: 'dosa',
      gramsPerServing: 100,
      caloriesPer100g: 168,
      macrosPer100g: Macros(protein: 3.9, carbs: 30, fat: 3.7, fiber: 1.2),
    ),
    FoodItem(
      name: 'Poha',
      emoji: '🍚',
      servingUnit: 'bowl',
      gramsPerServing: 200,
      caloriesPer100g: 110,
      macrosPer100g: Macros(protein: 2.5, carbs: 23, fat: 0.5, fiber: 0.8),
    ),
    FoodItem(
      name: 'Upma',
      emoji: '🍚',
      servingUnit: 'bowl',
      gramsPerServing: 200,
      caloriesPer100g: 120,
      macrosPer100g: Macros(protein: 3, carbs: 22, fat: 2.5, fiber: 1.5),
    ),
    FoodItem(
      name: 'Bread (white)',
      emoji: '🍞',
      servingUnit: 'slice',
      gramsPerServing: 30,
      caloriesPer100g: 265,
      macrosPer100g: Macros(protein: 9, carbs: 49, fat: 3.2, fiber: 2.7),
    ),
    FoodItem(
      name: 'Oats (cooked)',
      emoji: '🥣',
      servingUnit: 'bowl',
      gramsPerServing: 250,
      caloriesPer100g: 71,
      macrosPer100g: Macros(protein: 2.5, carbs: 12, fat: 1.5, fiber: 1.7),
    ),

    // ── Dal & Legumes ─────────────────────────────────────────────────────
    FoodItem(
      name: 'Dal (cooked)',
      emoji: '🥣',
      servingUnit: 'katori',
      gramsPerServing: 150,
      caloriesPer100g: 116,
      macrosPer100g: Macros(protein: 9, carbs: 20, fat: 0.4, fiber: 4),
    ),
    FoodItem(
      name: 'Rajma (cooked)',
      emoji: '🫘',
      servingUnit: 'katori',
      gramsPerServing: 150,
      caloriesPer100g: 127,
      macrosPer100g: Macros(protein: 8.7, carbs: 22, fat: 0.5, fiber: 6.4),
    ),
    FoodItem(
      name: 'Chana (cooked)',
      emoji: '🫘',
      servingUnit: 'katori',
      gramsPerServing: 150,
      caloriesPer100g: 164,
      macrosPer100g: Macros(protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6),
    ),
    FoodItem(
      name: 'Moong Dal (cooked)',
      emoji: '🥣',
      servingUnit: 'katori',
      gramsPerServing: 150,
      caloriesPer100g: 105,
      macrosPer100g: Macros(protein: 7, carbs: 19, fat: 0.4, fiber: 4),
    ),
    FoodItem(
      name: 'Chole (cooked)',
      emoji: '🫘',
      servingUnit: 'katori',
      gramsPerServing: 150,
      caloriesPer100g: 164,
      macrosPer100g: Macros(protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6),
    ),

    // ── Dairy ─────────────────────────────────────────────────────────────
    FoodItem(
      name: 'Milk (full fat)',
      emoji: '🥛',
      servingUnit: 'glass (250ml)',
      gramsPerServing: 250,
      caloriesPer100g: 61,
      macrosPer100g: Macros(protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0),
    ),
    FoodItem(
      name: 'Paneer',
      emoji: '🧀',
      servingUnit: 'piece (50g)',
      gramsPerServing: 50,
      caloriesPer100g: 265,
      macrosPer100g: Macros(protein: 18, carbs: 1.2, fat: 20, fiber: 0),
    ),
    FoodItem(
      name: 'Curd / Dahi',
      emoji: '🥛',
      servingUnit: 'katori',
      gramsPerServing: 150,
      caloriesPer100g: 98,
      macrosPer100g: Macros(protein: 3.5, carbs: 3.4, fat: 4.3, fiber: 0),
    ),
    FoodItem(
      name: 'Ghee',
      emoji: '🧈',
      servingUnit: 'tsp',
      gramsPerServing: 5,
      caloriesPer100g: 900,
      macrosPer100g: Macros(protein: 0, carbs: 0, fat: 99.7, fiber: 0),
    ),
    FoodItem(
      name: 'Whey Protein',
      emoji: '💪',
      servingUnit: 'scoop (30g)',
      gramsPerServing: 30,
      caloriesPer100g: 370,
      macrosPer100g: Macros(protein: 75, carbs: 8, fat: 4, fiber: 0),
    ),
    FoodItem(
      name: 'Buttermilk (Chaas)',
      emoji: '🥛',
      servingUnit: 'glass (200ml)',
      gramsPerServing: 200,
      caloriesPer100g: 40,
      macrosPer100g: Macros(protein: 3.3, carbs: 4.9, fat: 0.9, fiber: 0),
    ),

    // ── Eggs & Chicken ────────────────────────────────────────────────────
    FoodItem(
      name: 'Egg (whole)',
      emoji: '🥚',
      servingUnit: 'egg',
      gramsPerServing: 55,
      caloriesPer100g: 155,
      macrosPer100g: Macros(protein: 13, carbs: 1.1, fat: 11, fiber: 0),
    ),
    FoodItem(
      name: 'Egg White',
      emoji: '🥚',
      servingUnit: 'egg white',
      gramsPerServing: 33,
      caloriesPer100g: 52,
      macrosPer100g: Macros(protein: 11, carbs: 0.7, fat: 0.2, fiber: 0),
    ),
    FoodItem(
      name: 'Chicken Breast (cooked)',
      emoji: '🍗',
      servingUnit: 'piece (100g)',
      gramsPerServing: 100,
      caloriesPer100g: 165,
      macrosPer100g: Macros(protein: 31, carbs: 0, fat: 3.6, fiber: 0),
    ),
    FoodItem(
      name: 'Chicken Curry',
      emoji: '🍛',
      servingUnit: 'katori',
      gramsPerServing: 150,
      caloriesPer100g: 150,
      macrosPer100g: Macros(protein: 14, carbs: 5, fat: 9, fiber: 0.5),
    ),
    FoodItem(
      name: 'Fish (rohu, cooked)',
      emoji: '🐟',
      servingUnit: 'piece (100g)',
      gramsPerServing: 100,
      caloriesPer100g: 97,
      macrosPer100g: Macros(protein: 16, carbs: 0, fat: 3.4, fiber: 0),
    ),

    // ── Vegetables & Sabzi ────────────────────────────────────────────────
    FoodItem(
      name: 'Aloo Sabzi',
      emoji: '🥔',
      servingUnit: 'katori',
      gramsPerServing: 150,
      caloriesPer100g: 110,
      macrosPer100g: Macros(protein: 2, carbs: 20, fat: 3, fiber: 2.2),
    ),
    FoodItem(
      name: 'Palak Paneer',
      emoji: '🥬',
      servingUnit: 'katori',
      gramsPerServing: 150,
      caloriesPer100g: 180,
      macrosPer100g: Macros(protein: 8, carbs: 8, fat: 13, fiber: 2),
    ),
    FoodItem(
      name: 'Mixed Veg Sabzi',
      emoji: '🥦',
      servingUnit: 'katori',
      gramsPerServing: 150,
      caloriesPer100g: 80,
      macrosPer100g: Macros(protein: 3, carbs: 12, fat: 2.5, fiber: 3),
    ),
    FoodItem(
      name: 'Salad (mixed)',
      emoji: '🥗',
      servingUnit: 'bowl',
      gramsPerServing: 200,
      caloriesPer100g: 25,
      macrosPer100g: Macros(protein: 1.5, carbs: 4, fat: 0.3, fiber: 2),
    ),

    // ── Fruits ────────────────────────────────────────────────────────────
    FoodItem(
      name: 'Banana',
      emoji: '🍌',
      servingUnit: 'banana',
      gramsPerServing: 120,
      caloriesPer100g: 89,
      macrosPer100g: Macros(protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6),
    ),
    FoodItem(
      name: 'Apple',
      emoji: '🍎',
      servingUnit: 'apple',
      gramsPerServing: 150,
      caloriesPer100g: 52,
      macrosPer100g: Macros(protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4),
    ),
    FoodItem(
      name: 'Mango',
      emoji: '🥭',
      servingUnit: 'cup (sliced)',
      gramsPerServing: 165,
      caloriesPer100g: 60,
      macrosPer100g: Macros(protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6),
    ),
    FoodItem(
      name: 'Orange',
      emoji: '🍊',
      servingUnit: 'orange',
      gramsPerServing: 130,
      caloriesPer100g: 47,
      macrosPer100g: Macros(protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4),
    ),
    FoodItem(
      name: 'Papaya',
      emoji: '🍈',
      servingUnit: 'cup (cubed)',
      gramsPerServing: 145,
      caloriesPer100g: 43,
      macrosPer100g: Macros(protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7),
    ),

    // ── Snacks & Street Food ──────────────────────────────────────────────
    FoodItem(
      name: 'Samosa',
      emoji: '🥟',
      servingUnit: 'piece',
      gramsPerServing: 100,
      caloriesPer100g: 262,
      macrosPer100g: Macros(protein: 3.5, carbs: 28, fat: 15, fiber: 2),
    ),
    FoodItem(
      name: 'Peanuts (roasted)',
      emoji: '🥜',
      servingUnit: 'handful (30g)',
      gramsPerServing: 30,
      caloriesPer100g: 567,
      macrosPer100g: Macros(protein: 26, carbs: 16, fat: 49, fiber: 8.5),
    ),
    FoodItem(
      name: 'Almonds',
      emoji: '🌰',
      servingUnit: 'handful (20g)',
      gramsPerServing: 20,
      caloriesPer100g: 579,
      macrosPer100g: Macros(protein: 21, carbs: 22, fat: 50, fiber: 12.5),
    ),
    FoodItem(
      name: 'Chai (with milk & sugar)',
      emoji: '☕',
      servingUnit: 'cup',
      gramsPerServing: 150,
      caloriesPer100g: 40,
      macrosPer100g: Macros(protein: 1.5, carbs: 5, fat: 1.5, fiber: 0),
    ),
    FoodItem(
      name: 'Lassi (sweet)',
      emoji: '🥛',
      servingUnit: 'glass (300ml)',
      gramsPerServing: 300,
      caloriesPer100g: 70,
      macrosPer100g: Macros(protein: 3.5, carbs: 10, fat: 2, fiber: 0),
    ),
    FoodItem(
      name: 'Pav Bhaji',
      emoji: '🍞',
      servingUnit: 'plate (2 pav)',
      gramsPerServing: 300,
      caloriesPer100g: 150,
      macrosPer100g: Macros(protein: 5, carbs: 22, fat: 5, fiber: 3),
    ),
    FoodItem(
      name: 'Biryani (chicken)',
      emoji: '🍛',
      servingUnit: 'plate',
      gramsPerServing: 300,
      caloriesPer100g: 185,
      macrosPer100g: Macros(protein: 10, carbs: 25, fat: 6, fiber: 1),
    ),
  ];

  static List<FoodItem> search(String query) {
    if (query.isEmpty) return items;
    final q = query.toLowerCase();
    return items.where((f) => f.name.toLowerCase().contains(q)).toList();
  }
}
