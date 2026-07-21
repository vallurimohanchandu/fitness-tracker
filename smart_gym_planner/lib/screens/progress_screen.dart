import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/workout_provider.dart';
import '../providers/calorie_provider.dart';
import '../providers/weight_provider.dart';
import '../utils/app_theme.dart';
import 'weight_progress_screen.dart';

class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final workoutProv = context.watch<WorkoutProvider>();
    final calorieProv = context.watch<CalorieProvider>();
    final weightProv = context.watch<WeightProvider>();
    final plan = workoutProv.plan;
    final completed =
        plan?.days.where((d) => d.isCompleted).length ?? 0;
    final total = plan?.days.length ?? 0;
    final progress = total > 0 ? completed / total : 0.0;

    return Scaffold(
      appBar: AppBar(title: const Text('Progress')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // ── Progress ring ─────────────────────────────────────────────────
          _progressRing(completed, total, progress),
          const SizedBox(height: 20),

          // ── Stats row ─────────────────────────────────────────────────────
          Row(
            children: [
              Expanded(
                  child: _StatBox('Workouts Done', '$completed',
                      Icons.fitness_center, AppTheme.primary)),
              const SizedBox(width: 12),
              Expanded(
                  child: _StatBox('Remaining', '${total - completed}',
                      Icons.pending_outlined, AppTheme.warning)),
              const SizedBox(width: 12),
              Expanded(
                  child: _StatBox(
                      'Cal Burned',
                      '${workoutProv.caloriesBurnedToday}',
                      Icons.local_fire_department,
                      AppTheme.error)),
            ],
          ),
          const SizedBox(height: 24),

          // ── Workout history ───────────────────────────────────────────────
          const Text('Workout History',
              style: TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          if (plan != null)
            ...plan.days.map((day) => Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.bgCard,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                        color: day.isCompleted
                            ? AppTheme.accent.withOpacity(0.4)
                            : Colors.transparent),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 40, height: 40,
                        decoration: BoxDecoration(
                          color: day.isCompleted
                              ? AppTheme.accent.withOpacity(0.2)
                              : AppTheme.bgCard2,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          day.isCompleted
                              ? Icons.check
                              : Icons.lock_clock,
                          color: day.isCompleted
                              ? AppTheme.accent
                              : AppTheme.textSecondary,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(day.dayName,
                              style: const TextStyle(
                                  color: AppTheme.textPrimary,
                                  fontWeight: FontWeight.w600)),
                          Text(day.splitName,
                              style: const TextStyle(
                                  color: AppTheme.textSecondary,
                                  fontSize: 12)),
                        ],
                      ),
                      const Spacer(),
                      if (day.isCompleted)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.accent.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Text('Done',
                              style: TextStyle(
                                  color: AppTheme.accent,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600)),
                        )
                      else
                        const Text('Pending',
                            style: TextStyle(
                                color: AppTheme.textSecondary,
                                fontSize: 12)),
                    ],
                  ),
                )),

          const SizedBox(height: 24),

          // ── Weight progress teaser ────────────────────────────────────────
          GestureDetector(
            onTap: () => Navigator.push(context,
                MaterialPageRoute(
                    builder: (_) => const WeightProgressScreen())),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.bgCard,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                    color: AppTheme.primary.withOpacity(0.2)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppTheme.primary.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.monitor_weight_outlined,
                        color: AppTheme.primary, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Weight Progress',
                            style: TextStyle(
                                color: AppTheme.textPrimary,
                                fontWeight: FontWeight.bold,
                                fontSize: 15)),
                        Text(
                          weightProv.latest != null
                              ? 'Current: ${weightProv.latest!.weight} kg'
                              : 'Start logging your daily weight',
                          style: const TextStyle(
                              color: AppTheme.textSecondary,
                              fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right,
                      color: AppTheme.textSecondary),
                ],
              ),
            ),
          ),

          const SizedBox(height: 24),

          // ── Calorie bar chart ─────────────────────────────────────────────
          const Text('Calorie History (7 days)',
              style: TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          _calorieChart(calorieProv),
          const SizedBox(height: 80),
        ],
      ),
    );
  }

  Widget _progressRing(int completed, int total, double progress) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1A1A2E), Color(0xFF16213E)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 100, height: 100,
            child: Stack(
              alignment: Alignment.center,
              children: [
                CircularProgressIndicator(
                  value: progress,
                  strokeWidth: 8,
                  backgroundColor: AppTheme.bgCard2,
                  valueColor: const AlwaysStoppedAnimation<Color>(
                      AppTheme.primary),
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('${(progress * 100).toInt()}%',
                        style: const TextStyle(
                            color: AppTheme.textPrimary,
                            fontSize: 20,
                            fontWeight: FontWeight.bold)),
                    const Text('done',
                        style: TextStyle(
                            color: AppTheme.textSecondary,
                            fontSize: 10)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 24),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Weekly Progress',
                  style: TextStyle(
                      color: AppTheme.textSecondary, fontSize: 13)),
              const SizedBox(height: 4),
              Text('$completed of $total',
                  style: const TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 24,
                      fontWeight: FontWeight.bold)),
              const Text('workouts completed',
                  style: TextStyle(
                      color: AppTheme.textSecondary, fontSize: 13)),
              if (completed == total && total > 0) ...[
                const SizedBox(height: 10),
                const Row(
                  children: [
                    Icon(Icons.emoji_events,
                        color: AppTheme.warning, size: 18),
                    SizedBox(width: 6),
                    Text('Week Complete!',
                        style: TextStyle(
                            color: AppTheme.warning,
                            fontWeight: FontWeight.bold)),
                  ],
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Widget _calorieChart(CalorieProvider prov) {
    final summary = prov.weekSummary;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final maxCal =
        summary.fold(0, (m, s) => s.caloriesIn > m ? s.caloriesIn : m);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: AppTheme.bgCard,
          borderRadius: BorderRadius.circular(16)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: summary.asMap().entries.map((entry) {
          final i = entry.key;
          final s = entry.value;
          final barH =
              maxCal > 0 ? (s.caloriesIn / maxCal) * 80.0 : 4.0;
          final isToday = i == 6;
          return Expanded(
            child: Column(
              children: [
                Text(
                  s.caloriesIn > 0 ? '${s.caloriesIn}' : '',
                  style: const TextStyle(
                      color: AppTheme.textSecondary, fontSize: 8),
                ),
                const SizedBox(height: 4),
                Container(
                  height: barH.clamp(4.0, 80.0),
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  decoration: BoxDecoration(
                    color: isToday
                        ? AppTheme.primary
                        : AppTheme.accent.withOpacity(0.5),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(height: 6),
                Text(days[i],
                    style: TextStyle(
                        color: isToday
                            ? AppTheme.primary
                            : AppTheme.textSecondary,
                        fontSize: 11,
                        fontWeight: isToday
                            ? FontWeight.bold
                            : FontWeight.normal)),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _StatBox extends StatelessWidget {
  final String label, value;
  final IconData icon;
  final Color color;
  const _StatBox(this.label, this.value, this.icon, this.color);

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppTheme.bgCard,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 6),
            Text(value,
                style: TextStyle(
                    color: color,
                    fontSize: 20,
                    fontWeight: FontWeight.bold)),
            Text(label,
                style: const TextStyle(
                    color: AppTheme.textSecondary, fontSize: 10),
                textAlign: TextAlign.center),
          ],
        ),
      );
}
