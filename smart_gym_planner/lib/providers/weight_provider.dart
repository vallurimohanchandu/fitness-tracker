import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/weight_model.dart';

class WeightProvider extends ChangeNotifier {
  final List<WeightEntry> _entries = [];
  List<WeightEntry> get entries => List.unmodifiable(_entries);

  /// Sorted oldest → newest
  List<WeightEntry> get sorted {
    final list = [..._entries];
    list.sort((a, b) => a.date.compareTo(b.date));
    return list;
  }

  WeightEntry? get latest =>
      sorted.isNotEmpty ? sorted.last : null;

  WeightEntry? get earliest =>
      sorted.isNotEmpty ? sorted.first : null;

  /// Total change from first to last entry
  double? get totalChange {
    if (sorted.length < 2) return null;
    return sorted.last.weight - sorted.first.weight;
  }

  /// Whether today already has an entry
  bool get loggedToday {
    final now = DateTime.now();
    return _entries.any((e) =>
        e.date.year == now.year &&
        e.date.month == now.month &&
        e.date.day == now.day);
  }

  Future<void> loadFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('weight_entries');
    if (raw != null) {
      final List list = jsonDecode(raw);
      _entries
        ..clear()
        ..addAll(list.map((e) => WeightEntry.fromJson(e)));
      notifyListeners();
    }
  }

  Future<void> addEntry(double weight, {String? note}) async {
    // Replace today's entry if it exists
    final now = DateTime.now();
    _entries.removeWhere((e) =>
        e.date.year == now.year &&
        e.date.month == now.month &&
        e.date.day == now.day);

    _entries.add(WeightEntry(
      id: now.millisecondsSinceEpoch.toString(),
      weight: weight,
      date: now,
      note: note,
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
    await prefs.setString(
        'weight_entries',
        jsonEncode(_entries.map((e) => e.toJson()).toList()));
  }

  /// Last N days of entries (fills missing days with null)
  List<WeightEntry?> lastNDays(int n) {
    final now = DateTime.now();
    return List.generate(n, (i) {
      final day = now.subtract(Duration(days: n - 1 - i));
      try {
        return _entries.firstWhere((e) =>
            e.date.year == day.year &&
            e.date.month == day.month &&
            e.date.day == day.day);
      } catch (_) {
        return null;
      }
    });
  }
}
