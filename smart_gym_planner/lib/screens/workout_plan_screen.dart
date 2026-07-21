import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/exercise_model.dart';
import '../providers/workout_provider.dart';
import '../utils/app_theme.dart';
import '../widgets/workout_day_card.dart';
import 'workout_detail_screen.dart';

class WorkoutPlanScreen extends StatelessWidget {
  const WorkoutPlanScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final prov = context.watch<WorkoutProvider>();
    final plan = prov.plan;

    return Scaffold(
      appBar: AppBar(title: const Text('Workout Plan')),
      body: plan == null
          ? const Center(
              child: Text(
                'No plan yet.\nComplete onboarding first.',
                textAlign: TextAlign.center,
                style: TextStyle(color: AppTheme.textSecondary),
              ),
            )
          : ListView(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
              children: [
                // ── Plan header ─────────────────────────────────────────────
                _PlanHeader(plan: plan),
                const SizedBox(height: 20),

                // ── Split legend ────────────────────────────────────────────
                const Text('Muscle Splits',
                    style: TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 16,
                        fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                _buildSplitLegend(plan.days.length),
                const SizedBox(height: 20),

                // ── Day cards ───────────────────────────────────────────────
                const Text('Your Schedule',
                    style: TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 16,
                        fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                ...plan.days.asMap().entries.map(
                  (entry) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: WorkoutDayCard(
                      day: entry.value,
                      showCompleteButton: !entry.value.isCompleted,
                      onComplete: () => prov.markDayCompleted(entry.key),
                      // Navigate to WorkoutDetailScreen on tap
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) =>
                              WorkoutDetailScreen(day: entry.value),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildSplitLegend(int days) {
    final splits = days == 5
        ? [
            ('Chest + Triceps', AppTheme.primary, Icons.fitness_center),
            ('Back + Biceps', AppTheme.accent, Icons.sports_gymnastics),
            ('Legs', AppTheme.warning, Icons.directions_run),
            ('Shoulders + Core', const Color(0xFF9C27B0), Icons.sports_handball),
            ('Full Body', const Color(0xFF4CAF50), Icons.accessibility_new),
          ]
        : [
            ('Chest + Triceps', AppTheme.primary, Icons.fitness_center),
            ('Back + Biceps', AppTheme.accent, Icons.sports_gymnastics),
            ('Legs + Shoulders', AppTheme.warning, Icons.directions_run),
            ('Shoulders + Forearms', const Color(0xFF9C27B0), Icons.sports_handball),
          ];

    return Wrap(
      spacing: 8, runSpacing: 8,
      children: splits.map((s) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: s.$2.withOpacity(0.1),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: s.$2.withOpacity(0.3)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(s.$3, color: s.$2, size: 14),
            const SizedBox(width: 6),
            Text(s.$1,
                style: TextStyle(
                    color: s.$2,
                    fontSize: 12,
                    fontWeight: FontWeight.w500)),
          ],
        ),
      )).toList(),
    );
  }
}

// ── Plan header card ───────────────────────────────────────────────────────────
class _PlanHeader extends StatelessWidget {
  final WorkoutPlan plan;
  const _PlanHeader({required this.plan});

  @override
  Widget build(BuildContext context) {
    final completed = plan.days.where((d) => d.isCompleted).length;
    final total = plan.days.length;
    final progress = total > 0 ? completed / total : 0.0;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1A1A2E), Color(0xFF16213E)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.primary.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('$total-Day Split',
                      style: const TextStyle(
                          color: AppTheme.primary,
                          fontSize: 13,
                          fontWeight: FontWeight.w600)),
                  const SizedBox(height: 4),
                  Text(
                    '${plan.generatedFor[0].toUpperCase()}'
                    '${plan.generatedFor.substring(1)} Program',
                    style: const TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 20,
                        fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const Spacer(),
              const Icon(Icons.calendar_month,
                  color: AppTheme.primary, size: 44),
            ],
          ),
          const SizedBox(height: 16),
          // Progress bar
          Row(
            children: [
              Text('$completed/$total done',
                  style: const TextStyle(
                      color: AppTheme.textSecondary, fontSize: 12)),
              const Spacer(),
              Text('${(progress * 100).toInt()}%',
                  style: const TextStyle(
                      color: AppTheme.primary,
                      fontSize: 12,
                      fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: progress,
              backgroundColor: AppTheme.bgCard2,
              valueColor:
                  const AlwaysStoppedAnimation<Color>(AppTheme.primary),
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }
}
