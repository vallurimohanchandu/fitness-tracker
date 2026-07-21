import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/calorie_model.dart';
import '../providers/user_provider.dart';
import '../providers/workout_provider.dart';
import '../providers/calorie_provider.dart';
import '../providers/weight_provider.dart';
import '../utils/app_theme.dart';
import '../widgets/stat_card.dart';
import '../widgets/workout_day_card.dart';
import 'weight_progress_screen.dart';
import 'workout_detail_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = context.watch<UserProvider>().user;
    final workoutProv = context.watch<WorkoutProvider>();
    final calorieProv = context.watch<CalorieProvider>();
    final weightProv = context.watch<WeightProvider>();
    final today = workoutProv.todayWorkout;

    // Compute nutrition target if height/weight available
    NutritionTarget? target;
    if (user?.height != null && user?.weight != null) {
      target = NutritionTarget.calculate(
        weight: user!.weight!,
        height: user.height!,
        goal: user.goal,
      );
    }

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // ── Greeting header ───────────────────────────────────────────────
          SliverAppBar(
            expandedHeight: 120,
            floating: true,
            backgroundColor: AppTheme.bgDark,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF1A1A2E), AppTheme.bgDark],
                  ),
                ),
                padding: const EdgeInsets.fromLTRB(20, 50, 20, 12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Good ${_greeting()},',
                            style: const TextStyle(
                                color: AppTheme.textSecondary, fontSize: 13)),
                        Text(user?.name ?? 'Athlete',
                            style: const TextStyle(
                                color: AppTheme.textPrimary,
                                fontSize: 22,
                                fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppTheme.primary.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                            color: AppTheme.primary.withOpacity(0.4)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.local_fire_department,
                              color: AppTheme.primary, size: 14),
                          const SizedBox(width: 4),
                          Text(_goalLabel(user?.goal),
                              style: const TextStyle(
                                  color: AppTheme.primary,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // ── Stats row ─────────────────────────────────────────────
                Row(
                  children: [
                    Expanded(child: StatCard(
                      icon: Icons.local_fire_department,
                      label: 'Burned',
                      value: '${workoutProv.caloriesBurnedToday}',
                      unit: 'kcal',
                      color: AppTheme.error,
                    )),
                    const SizedBox(width: 10),
                    Expanded(child: StatCard(
                      icon: Icons.restaurant,
                      label: 'Intake',
                      value: '${calorieProv.todayCaloriesIn}',
                      unit: 'kcal',
                      color: AppTheme.accent,
                    )),
                    const SizedBox(width: 10),
                    Expanded(child: StatCard(
                      icon: Icons.monitor_weight_outlined,
                      label: 'Weight',
                      value: weightProv.latest != null
                          ? '${weightProv.latest!.weight}'
                          : '--',
                      unit: weightProv.latest != null ? 'kg' : 'not logged',
                      color: AppTheme.primary,
                    )),
                  ],
                ),
                const SizedBox(height: 20),

                // ── Nutrition targets (if available) ──────────────────────
                if (target != null) ...[
                  _NutritionSummary(
                    target: target,
                    consumed: calorieProv.todayCaloriesIn,
                    macros: calorieProv.todayMacros,
                  ),
                  const SizedBox(height: 20),
                ],

                // ── Today's workout ───────────────────────────────────────
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text("Today's Workout",
                        style: TextStyle(
                            color: AppTheme.textPrimary,
                            fontSize: 17,
                            fontWeight: FontWeight.bold)),
                    if (today != null)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.accent.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(today.dayName,
                            style: const TextStyle(
                                color: AppTheme.accent,
                                fontSize: 11,
                                fontWeight: FontWeight.w600)),
                      ),
                  ],
                ),
                const SizedBox(height: 10),

                if (today != null)
                  WorkoutDayCard(
                    day: today,
                    onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) =>
                                WorkoutDetailScreen(day: today))),
                  )
                else
                  _allDoneCard(),

                const SizedBox(height: 20),

                // ── Weekly overview ───────────────────────────────────────
                _weeklyOverview(context, workoutProv),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _allDoneCard() => Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: AppTheme.bgCard,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Column(
          children: [
            Icon(Icons.check_circle, color: AppTheme.accent, size: 44),
            SizedBox(height: 10),
            Text('All workouts completed!',
                style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 15,
                    fontWeight: FontWeight.bold)),
            SizedBox(height: 4),
            Text('Great job this week. Rest and recover.',
                style: TextStyle(
                    color: AppTheme.textSecondary, fontSize: 12)),
          ],
        ),
      );

  Widget _weeklyOverview(BuildContext context, WorkoutProvider prov) {
    final plan = prov.plan;
    if (plan == null) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Weekly Plan',
            style: TextStyle(
                color: AppTheme.textPrimary,
                fontSize: 17,
                fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        ...plan.days.asMap().entries.map((entry) {
          final i = entry.key;
          final day = entry.value;
          return GestureDetector(
            onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (_) => WorkoutDetailScreen(day: day))),
            child: Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.symmetric(
                  horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: day.isCompleted
                    ? AppTheme.accent.withOpacity(0.1)
                    : AppTheme.bgCard,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                    color: day.isCompleted
                        ? AppTheme.accent.withOpacity(0.4)
                        : Colors.transparent),
              ),
              child: Row(
                children: [
                  Container(
                    width: 34, height: 34,
                    decoration: BoxDecoration(
                      color: day.isCompleted
                          ? AppTheme.accent
                          : AppTheme.primary.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: day.isCompleted
                          ? const Icon(Icons.check,
                              color: Colors.white, size: 16)
                          : Text('${i + 1}',
                              style: const TextStyle(
                                  color: AppTheme.primary,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(day.dayName,
                            style: const TextStyle(
                                color: AppTheme.textPrimary,
                                fontWeight: FontWeight.w600,
                                fontSize: 13)),
                        Text(day.splitName,
                            style: const TextStyle(
                                color: AppTheme.textSecondary,
                                fontSize: 11)),
                      ],
                    ),
                  ),
                  Text('${day.exercises.length} ex',
                      style: const TextStyle(
                          color: AppTheme.textSecondary, fontSize: 11)),
                  const SizedBox(width: 6),
                  const Icon(Icons.chevron_right,
                      color: AppTheme.textSecondary, size: 16),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  String _greeting() {
    final h = DateTime.now().hour;
    if (h < 12) return 'Morning';
    if (h < 17) return 'Afternoon';
    return 'Evening';
  }

  String _goalLabel(String? goal) {
    const map = {
      'fat_loss': 'Fat Loss',
      'muscle_gain': 'Muscle Gain',
      'maintain': 'Maintain'
    };
    return map[goal] ?? 'Training';
  }
}

// ── Nutrition summary widget for dashboard ────────────────────────────────────
class _NutritionSummary extends StatelessWidget {
  final NutritionTarget target;
  final int consumed;
  final Macros macros;

  const _NutritionSummary({
    required this.target,
    required this.consumed,
    required this.macros,
  });

  @override
  Widget build(BuildContext context) {
    final remaining = (target.calories - consumed).clamp(0, target.calories);
    final progress = consumed / target.calories;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.bgCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.primary.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.local_dining,
                  color: AppTheme.primary, size: 16),
              const SizedBox(width: 6),
              const Text('Daily Nutrition',
                  style: TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 14,
                      fontWeight: FontWeight.bold)),
              const Spacer(),
              Text('$consumed / ${target.calories} kcal',
                  style: const TextStyle(
                      color: AppTheme.textSecondary, fontSize: 11)),
            ],
          ),
          const SizedBox(height: 10),
          // Calorie progress bar
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: progress.clamp(0.0, 1.0),
              backgroundColor: AppTheme.bgCard2,
              valueColor: AlwaysStoppedAnimation<Color>(
                  progress > 1.0 ? AppTheme.error : AppTheme.primary),
              minHeight: 8,
            ),
          ),
          const SizedBox(height: 6),
          Text('$remaining kcal remaining',
              style: const TextStyle(
                  color: AppTheme.textSecondary, fontSize: 11)),
          const SizedBox(height: 12),
          // Macro row
          Row(
            children: [
              _MacroBar('Protein', macros.protein, target.protein,
                  const Color(0xFF2196F3)),
              const SizedBox(width: 8),
              _MacroBar('Carbs', macros.carbs, target.carbs,
                  AppTheme.warning),
              const SizedBox(width: 8),
              _MacroBar('Fat', macros.fat, target.fat, AppTheme.error),
            ],
          ),
        ],
      ),
    );
  }
}

class _MacroBar extends StatelessWidget {
  final String label;
  final double current, target;
  final Color color;
  const _MacroBar(this.label, this.current, this.target, this.color);

  @override
  Widget build(BuildContext context) {
    final progress = target > 0 ? (current / target).clamp(0.0, 1.0) : 0.0;
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label,
                  style: const TextStyle(
                      color: AppTheme.textSecondary, fontSize: 10)),
              Text('${current.toStringAsFixed(0)}g',
                  style: TextStyle(
                      color: color,
                      fontSize: 10,
                      fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 4),
          ClipRRect(
            borderRadius: BorderRadius.circular(3),
            child: LinearProgressIndicator(
              value: progress,
              backgroundColor: color.withOpacity(0.15),
              valueColor: AlwaysStoppedAnimation<Color>(color),
              minHeight: 5,
            ),
          ),
        ],
      ),
    );
  }
}
