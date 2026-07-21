import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/calorie_model.dart';

class CalorieProvider extends ChangeNotifier {
  final List<FoodEntry> _entries = [];
  List<FoodEntry> get entries => List.unmodifiable(_entries);

  /// Today's entries only
  List<FoodEntry> get todayEntries {
    final now = DateTime.now();
    return _entries.where((e) =>
        e.timestamp.year == now.year &&
        e.timestamp.month == now.month &&
        e.timestamp.day == now.day).toList();
  }

  int get todayCaloriesIn =>
      todayEntries.fold(0, (sum, e) => sum + e.calories);

  /// Today's total macros
  Macros get todayMacros => todayEntries.fold(
      const Macros(), (sum, e) => sum + e.macros);

  Future<void> loadFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString('calorie_entries');
    if (jsonStr != null) {
      final List list = jsonDecode(jsonStr);
      _entries
        ..clear()
        ..addAll(list.map((e) => FoodEntry.fromJson(e)));
      notifyListeners();
    }
  }

  Future<void> addEntry(String name, int calories, Macros macros) async {
    _entries.add(FoodEntry(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: name,
      calories: calories,
      macros: macros,
      timestamp: DateTime.now(),
    ));
    await _persist();
    notifyListeners();
  }

  Future<void> removeEntry(String id) async {
    _entries.removeWhere((e) => e.id == id);
    await _persist();
    notifyListeners();
  }

  Future<void> _persist() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('calorie_entries',
        jsonEncode(_entries.map((e) => e.toJson()).toList()));
  }

  /// Last 7 days for the progress bar chart
  List<DailyCalorieSummary> get weekSummary {
    final now = DateTime.now();
    return List.generate(7, (i) {
      final day = now.subtract(Duration(days: 6 - i));
      final dayEntries = _entries.where((e) =>
          e.timestamp.year == day.year &&
          e.timestamp.month == day.month &&
          e.timestamp.day == day.day);
      return DailyCalorieSummary(
        date: day,
        caloriesIn: dayEntries.fold(0, (s, e) => s + e.calories),
        caloriesBurned: 0,
      );
    });
  }
}
