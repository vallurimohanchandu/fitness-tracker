import 'package:flutter/material.dart';
import '../models/exercise_model.dart';
import '../utils/app_theme.dart';

/// Card showing a workout day summary with exercise preview chips
class WorkoutDayCard extends StatelessWidget {
  final WorkoutDay day;
  final VoidCallback onTap;
  final bool showCompleteButton;
  final VoidCallback? onComplete;

  const WorkoutDayCard({
    super.key,
    required this.day,
    required this.onTap,
    this.showCompleteButton = false,
    this.onComplete,
  });

  Color get _splitColor {
    if (day.splitName.contains('Chest')) return AppTheme.primary;
    if (day.splitName.contains('Back')) return AppTheme.accent;
    if (day.splitName.contains('Legs')) return AppTheme.warning;
    return const Color(0xFF9C27B0);
  }

  IconData get _splitIcon {
    if (day.splitName.contains('Chest')) return Icons.fitness_center;
    if (day.splitName.contains('Back')) return Icons.sports_gymnastics;
    if (day.splitName.contains('Legs')) return Icons.directions_run;
    return Icons.sports_handball;
  }

  @override
  Widget build(BuildContext context) {
    final color = _splitColor;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [color.withOpacity(0.15), AppTheme.bgCard],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            // Header row
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(_splitIcon, color: color, size: 22),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(day.splitName,
                          style: const TextStyle(
                              color: AppTheme.textPrimary,
                              fontSize: 16,
                              fontWeight: FontWeight.bold)),
                      Text(day.dayName,
                          style: const TextStyle(
                              color: AppTheme.textSecondary, fontSize: 12)),
                    ],
                  ),
                  const Spacer(),
                  if (day.isCompleted)
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.accent.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.check, color: AppTheme.accent, size: 14),
                          SizedBox(width: 4),
                          Text('Done',
                              style: TextStyle(
                                  color: AppTheme.accent, fontSize: 12)),
                        ],
                      ),
                    )
                  else
                    const Icon(Icons.chevron_right,
                        color: AppTheme.textSecondary),
                ],
              ),
            ),

            // Stats strip
            Container(
              margin: const EdgeInsets.fromLTRB(16, 0, 16, 12),
              padding: const EdgeInsets.symmetric(vertical: 10),
              decoration: BoxDecoration(
                color: AppTheme.bgDark.withOpacity(0.5),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _Stat('${day.exercises.length}', 'Exercises',
                      Icons.fitness_center),
                  _VertDivider(),
                  _Stat('${day.totalSets}', 'Sets', Icons.repeat),
                  _VertDivider(),
                  _Stat('~${day.estimatedCalories}', 'kcal',
                      Icons.local_fire_department),
                ],
              ),
            ),

            // Exercise name chips
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
              child: Wrap(
                spacing: 6,
                runSpacing: 6,
                children: [
                  ...day.exercises.take(4).map((e) => _ExChip(e.name, color)),
                  if (day.exercises.length > 4)
                    _ExChip('+${day.exercises.length - 4} more',
                        AppTheme.textSecondary),
                ],
              ),
            ),

            // Optional complete button
            if (showCompleteButton && !day.isCompleted)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                child: GestureDetector(
                  onTap: onComplete,
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                      color: AppTheme.accent.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                          color: AppTheme.accent.withOpacity(0.4)),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.check_circle_outline,
                            color: AppTheme.accent, size: 16),
                        SizedBox(width: 6),
                        Text('Mark Complete',
                            style: TextStyle(
                                color: AppTheme.accent,
                                fontSize: 13,
                                fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  final String value, label;
  final IconData icon;
  const _Stat(this.value, this.label, this.icon);

  @override
  Widget build(BuildContext context) => Column(
        children: [
          Row(children: [
            Icon(icon, color: AppTheme.textSecondary, size: 12),
            const SizedBox(width: 4),
            Text(value,
                style: const TextStyle(
                    color: AppTheme.textPrimary,
                    fontWeight: FontWeight.bold,
                    fontSize: 14)),
          ]),
          Text(label,
              style: const TextStyle(
                  color: AppTheme.textSecondary, fontSize: 10)),
        ],
      );
}

class _VertDivider extends StatelessWidget {
  @override
  Widget build(BuildContext context) =>
      Container(width: 1, height: 28, color: const Color(0xFF2A2A3E));
}

class _ExChip extends StatelessWidget {
  final String label;
  final Color color;
  const _ExChip(this.label, this.color);

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(label,
            style: TextStyle(color: color, fontSize: 11)),
      );
}
