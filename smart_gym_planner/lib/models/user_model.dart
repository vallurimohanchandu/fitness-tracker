// User profile model — stores all onboarding selections and body stats
class UserModel {
  final String experienceLevel; // beginner | intermediate | expert
  final int workoutDaysPerWeek; // 5 | 6 | 7
  final String goal; // fat_loss | muscle_gain | maintain
  final List<String> equipment;
  final double? height; // cm
  final double? weight; // kg
  final String? name;

  const UserModel({
    required this.experienceLevel,
    required this.workoutDaysPerWeek,
    required this.goal,
    required this.equipment,
    this.height,
    this.weight,
    this.name,
  });

  double? get bmi {
    if (height == null || weight == null || height! <= 0) return null;
    final hm = height! / 100;
    return weight! / (hm * hm);
  }

  String get bmiCategory {
    final b = bmi;
    if (b == null) return 'Unknown';
    if (b < 18.5) return 'Underweight';
    if (b < 25.0) return 'Normal';
    if (b < 30.0) return 'Overweight';
    return 'Obese';
  }

  UserModel copyWith({
    String? experienceLevel,
    int? workoutDaysPerWeek,
    String? goal,
    List<String>? equipment,
    double? height,
    double? weight,
    String? name,
  }) =>
      UserModel(
        experienceLevel: experienceLevel ?? this.experienceLevel,
        workoutDaysPerWeek: workoutDaysPerWeek ?? this.workoutDaysPerWeek,
        goal: goal ?? this.goal,
        equipment: equipment ?? this.equipment,
        height: height ?? this.height,
        weight: weight ?? this.weight,
        name: name ?? this.name,
      );

  Map<String, dynamic> toJson() => {
        'experienceLevel': experienceLevel,
        'workoutDaysPerWeek': workoutDaysPerWeek,
        'goal': goal,
        'equipment': equipment.join(','),
        'height': height,
        'weight': weight,
        'name': name,
      };

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        experienceLevel: json['experienceLevel'] ?? 'beginner',
        workoutDaysPerWeek: json['workoutDaysPerWeek'] ?? 5,
        goal: json['goal'] ?? 'muscle_gain',
        equipment: (json['equipment'] as String? ?? '')
            .split(',')
            .where((e) => e.isNotEmpty)
            .toList(),
        height: json['height'] != null
            ? double.tryParse(json['height'].toString())
            : null,
        weight: json['weight'] != null
            ? double.tryParse(json['weight'].toString())
            : null,
        name: json['name'],
      );
}
