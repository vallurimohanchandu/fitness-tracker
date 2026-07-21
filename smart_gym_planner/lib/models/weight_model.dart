/// A single daily weight entry
class WeightEntry {
  final String id;
  final double weight; // kg
  final DateTime date;
  final String? note;

  const WeightEntry({
    required this.id,
    required this.weight,
    required this.date,
    this.note,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'weight': weight,
        'date': date.toIso8601String(),
        'note': note,
      };

  factory WeightEntry.fromJson(Map<String, dynamic> j) => WeightEntry(
        id: j['id'],
        weight: (j['weight'] as num).toDouble(),
        date: DateTime.parse(j['date']),
        note: j['note'],
      );
}
