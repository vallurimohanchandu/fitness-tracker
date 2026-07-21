import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/exercise_model.dart';
import '../providers/workout_provider.dart';
import '../utils/app_theme.dart';

/// Full workout detail screen — shows warmup, cardio, exercises, stretching
class WorkoutDetailScreen extends StatefulWidget {
  final WorkoutDay day;
  const WorkoutDetailScreen({super.key, required this.day});

  @override
  State<WorkoutDetailScreen> createState() => _WorkoutDetailScreenState();
}

class _WorkoutDetailScreenState extends State<WorkoutDetailScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabs;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  Color get _splitColor {
    final s = widget.day.splitName;
    if (s.contains('Chest')) return AppTheme.primary;
    if (s.contains('Back')) return AppTheme.accent;
    if (s.contains('Legs')) return AppTheme.warning;
    if (s.contains('Full')) return const Color(0xFF4CAF50);
    return const Color(0xFF9C27B0);
  }

  @override
  Widget build(BuildContext context) {
    final day = widget.day;
    final color = _splitColor;

    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      body: NestedScrollView(
        headerSliverBuilder: (_, __) => [
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: AppTheme.bgDark,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [color.withOpacity(0.4), AppTheme.bgDark],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 50, 20, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Day badge
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: color.withOpacity(0.3),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: color.withOpacity(0.5)),
                          ),
                          child: Text(day.dayName,
                              style: TextStyle(
                                  color: color,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600)),
                        ),
                        const SizedBox(height: 8),
                        // Split name
                        Text(day.splitName,
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.bold)),
                        const SizedBox(height: 12),
                        // Stats row
                        Row(
                          children: [
                            _HStat(Icons.fitness_center,
                                '${day.exercises.length}', 'Exercises'),
                            const SizedBox(width: 20),
                            _HStat(Icons.repeat, '${day.totalSets}', 'Sets'),
                            const SizedBox(width: 20),
                            _HStat(Icons.local_fire_department,
                                '~${day.estimatedCalories}', 'kcal'),
                            const SizedBox(width: 20),
                            _HStat(Icons.timer, '45-60', 'min'),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            bottom: TabBar(
              controller: _tabs,
              indicatorColor: color,
              labelColor: color,
              unselectedLabelColor: AppTheme.textSecondary,
              isScrollable: true,
              tabAlignment: TabAlignment.start,
              tabs: const [
                Tab(text: '🔥 Warm-Up'),
                Tab(text: '🏃 Cardio'),
                Tab(text: '💪 Workout'),
                Tab(text: '🧘 Stretch'),
              ],
            ),
          ),
        ],
        body: TabBarView(
          controller: _tabs,
          children: [
            _ExerciseListTab(
                exercises: day.warmup,
                color: AppTheme.warning,
                emptyMsg: 'No warm-up exercises'),
            _ExerciseListTab(
                exercises: day.cardio,
                color: const Color(0xFF4CAF50),
                emptyMsg: 'No cardio today'),
            _ExerciseListTab(
                exercises: day.exercises,
                color: color,
                emptyMsg: 'No exercises'),
            _ExerciseListTab(
                exercises: day.stretching,
                color: AppTheme.accent,
                emptyMsg: 'No stretching exercises'),
          ],
        ),
      ),
      // Complete workout button
      bottomNavigationBar: day.isCompleted
          ? _completedBanner()
          : SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                child: ElevatedButton.icon(
                  onPressed: () => _markComplete(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: color,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                  ),
                  icon: const Icon(Icons.check_circle_outline,
                      color: Colors.white),
                  label: const Text('Mark Workout Complete',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold)),
                ),
              ),
            ),
    );
  }

  Widget _completedBanner() => Container(
        color: AppTheme.bgCard,
        padding: const EdgeInsets.all(16),
        child: SafeArea(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Icon(Icons.check_circle, color: AppTheme.accent),
              SizedBox(width: 8),
              Text('Workout Completed!',
                  style: TextStyle(
                      color: AppTheme.accent, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      );

  void _markComplete(BuildContext context) {
    final prov = context.read<WorkoutProvider>();
    final plan = prov.plan;
    if (plan != null) {
      final idx = plan.days.indexOf(widget.day);
      if (idx >= 0) prov.markDayCompleted(idx);
    }
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Row(
          children: [
            Icon(Icons.emoji_events, color: Colors.white),
            SizedBox(width: 8),
            Text('Workout completed! Great job! 💪'),
          ],
        ),
        backgroundColor: AppTheme.accent,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}

// ── Exercise list tab ──────────────────────────────────────────────────────────
class _ExerciseListTab extends StatelessWidget {
  final List<ExerciseModel> exercises;
  final Color color;
  final String emptyMsg;

  const _ExerciseListTab({
    required this.exercises,
    required this.color,
    required this.emptyMsg,
  });

  @override
  Widget build(BuildContext context) {
    if (exercises.isEmpty) {
      return Center(
          child: Text(emptyMsg,
              style: const TextStyle(color: AppTheme.textSecondary)));
    }
    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
      itemCount: exercises.length,
      itemBuilder: (_, i) =>
          _ExerciseCard(exercise: exercises[i], color: color, index: i + 1),
    );
  }
}

// ── Expandable exercise card with image ───────────────────────────────────────
class _ExerciseCard extends StatefulWidget {
  final ExerciseModel exercise;
  final Color color;
  final int index;

  const _ExerciseCard(
      {required this.exercise, required this.color, required this.index});

  @override
  State<_ExerciseCard> createState() => _ExerciseCardState();
}

class _ExerciseCardState extends State<_ExerciseCard> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    final ex = widget.exercise;
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: AppTheme.bgCard,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: widget.color.withOpacity(0.25)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Exercise image ───────────────────────────────────────────────
          ClipRRect(
            borderRadius:
                const BorderRadius.vertical(top: Radius.circular(18)),
            child: SizedBox(
              height: 160,
              width: double.infinity,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  // Network image with fallback
                  Image.network(
                    ex.imageUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      color: AppTheme.bgCard2,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.fitness_center,
                              color: widget.color.withOpacity(0.4), size: 48),
                          const SizedBox(height: 6),
                          Text(ex.name,
                              style: TextStyle(
                                  color: widget.color.withOpacity(0.6),
                                  fontSize: 12)),
                        ],
                      ),
                    ),
                    loadingBuilder: (_, child, progress) {
                      if (progress == null) return child;
                      return Container(
                        color: AppTheme.bgCard2,
                        child: Center(
                          child: CircularProgressIndicator(
                              color: widget.color, strokeWidth: 2),
                        ),
                      );
                    },
                  ),
                  // Gradient overlay
                  Positioned.fill(
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            AppTheme.bgCard.withOpacity(0.7),
                          ],
                        ),
                      ),
                    ),
                  ),
                  // Index badge
                  Positioned(
                    top: 10, left: 10,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: widget.color,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text('#${widget.index}',
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.bold)),
                    ),
                  ),
                  // Difficulty badge
                  Positioned(
                    top: 10, right: 10,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(ex.difficulty,
                          style: const TextStyle(
                              color: Colors.white70, fontSize: 11)),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ── Exercise info ────────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Name + expand toggle
                Row(
                  children: [
                    Expanded(
                      child: Text(ex.name,
                          style: const TextStyle(
                              color: AppTheme.textPrimary,
                              fontSize: 16,
                              fontWeight: FontWeight.bold)),
                    ),
                    GestureDetector(
                      onTap: () => setState(() => _expanded = !_expanded),
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: widget.color.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          _expanded
                              ? Icons.keyboard_arrow_up
                              : Icons.keyboard_arrow_down,
                          color: widget.color,
                          size: 20,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                // Sets / reps / muscle chips
                Wrap(
                  spacing: 8, runSpacing: 6,
                  children: [
                    _Chip(Icons.repeat, '${ex.sets} sets', widget.color),
                    _Chip(Icons.numbers, '${ex.reps} reps', widget.color),
                    _Chip(Icons.category_outlined,
                        ex.muscleGroup, AppTheme.textSecondary),
                  ],
                ),
                // Expandable instructions
                if (_expanded) ...[
                  const SizedBox(height: 12),
                  const Divider(color: Color(0xFF2A2A3E)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.info_outline,
                          color: widget.color, size: 14),
                      const SizedBox(width: 6),
                      const Text('How to perform',
                          style: TextStyle(
                              color: AppTheme.textSecondary,
                              fontSize: 12,
                              fontWeight: FontWeight.w600)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(ex.instructions,
                      style: const TextStyle(
                          color: AppTheme.textPrimary,
                          fontSize: 13,
                          height: 1.6)),
                  if (ex.requiredEquipment.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(Icons.sports_gymnastics,
                            color: AppTheme.textSecondary, size: 14),
                        const SizedBox(width: 6),
                        Text(
                            'Equipment: ${ex.requiredEquipment.join(', ')}',
                            style: const TextStyle(
                                color: AppTheme.textSecondary,
                                fontSize: 12)),
                      ],
                    ),
                  ],
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _Chip(this.icon, this.label, this.color);

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: color, size: 12),
            const SizedBox(width: 4),
            Text(label,
                style: TextStyle(
                    color: color,
                    fontSize: 11,
                    fontWeight: FontWeight.w500)),
          ],
        ),
      );
}

class _HStat extends StatelessWidget {
  final IconData icon;
  final String value, label;
  const _HStat(this.icon, this.value, this.label);

  @override
  Widget build(BuildContext context) => Row(
        children: [
          Icon(icon, color: Colors.white54, size: 14),
          const SizedBox(width: 4),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(value,
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.bold)),
              Text(label,
                  style: const TextStyle(
                      color: Colors.white54, fontSize: 10)),
            ],
          ),
        ],
      );
}
