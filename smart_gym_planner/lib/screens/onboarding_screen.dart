import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/user_model.dart';
import '../providers/user_provider.dart';
import '../providers/workout_provider.dart';
import '../utils/app_theme.dart';
import '../widgets/gradient_button.dart';
import '../widgets/selection_chip.dart';
import 'main_nav_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _pageCtrl = PageController();
  int _page = 0;

  String _level = 'beginner';
  int _days = 5;
  String _goal = 'muscle_gain';
  final List<String> _equipment = [];
  final _customCtrl = TextEditingController();

  static const _equipOptions = [
    'dumbbells', 'barbell', 'machines', 'resistance_bands', 'none'
  ];

  @override
  void dispose() {
    _pageCtrl.dispose();
    _customCtrl.dispose();
    super.dispose();
  }

  void _next() {
    if (_page < 3) {
      _pageCtrl.nextPage(
          duration: const Duration(milliseconds: 350),
          curve: Curves.easeInOut);
    } else {
      _finish();
    }
  }

  void _back() => _pageCtrl.previousPage(
      duration: const Duration(milliseconds: 350), curve: Curves.easeInOut);

  Future<void> _finish() async {
    final eq = _equipment.isEmpty ? ['none'] : _equipment;
    final user = UserModel(
      experienceLevel: _level,
      workoutDaysPerWeek: _days,
      goal: _goal,
      equipment: eq,
    );
    await context.read<UserProvider>().saveUser(user);
    if (mounted) {
      context.read<WorkoutProvider>().generatePlan(user);
      Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const MainNavScreen()));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Progress bar
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: Row(
                children: List.generate(
                  4,
                  (i) => Expanded(
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      height: 4,
                      margin: const EdgeInsets.symmetric(horizontal: 3),
                      decoration: BoxDecoration(
                        color: i <= _page
                            ? AppTheme.primary
                            : AppTheme.bgCard,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                ),
              ),
            ),
            Expanded(
              child: PageView(
                controller: _pageCtrl,
                physics: const NeverScrollableScrollPhysics(),
                onPageChanged: (p) => setState(() => _page = p),
                children: [
                  _levelPage(),
                  _daysPage(),
                  _goalPage(),
                  _equipmentPage(),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: Row(
                children: [
                  if (_page > 0) ...[
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _back,
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppTheme.primary),
                          foregroundColor: AppTheme.primary,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('Back'),
                      ),
                    ),
                    const SizedBox(width: 12),
                  ],
                  Expanded(
                    flex: 2,
                    child: GradientButton(
                      label: _page == 3 ? 'Start Training' : 'Continue',
                      onTap: _next,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Page 1: Experience Level ───────────────────────────────────────────────
  Widget _levelPage() => _Page(
        icon: Icons.fitness_center,
        title: 'Experience Level',
        subtitle: 'How long have you been training?',
        child: Column(
          children: [
            _LevelCard(
              title: 'Beginner', subtitle: '1–4 months',
              icon: Icons.star_outline,
              selected: _level == 'beginner',
              onTap: () => setState(() => _level = 'beginner'),
            ),
            const SizedBox(height: 12),
            _LevelCard(
              title: 'Intermediate', subtitle: '4–12 months',
              icon: Icons.star_half,
              selected: _level == 'intermediate',
              onTap: () => setState(() => _level = 'intermediate'),
            ),
            const SizedBox(height: 12),
            _LevelCard(
              title: 'Expert', subtitle: '1+ year',
              icon: Icons.star,
              selected: _level == 'expert',
              onTap: () => setState(() => _level = 'expert'),
            ),
          ],
        ),
      );

  // ── Page 2: Workout Days ───────────────────────────────────────────────────
  Widget _daysPage() => _Page(
        icon: Icons.calendar_today,
        title: 'Workout Days',
        subtitle: 'How many days per week?',
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [5, 6, 7].map((d) {
            final sel = _days == d;
            return GestureDetector(
              onTap: () => setState(() => _days = d),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: 90, height: 90,
                decoration: BoxDecoration(
                  color: sel ? AppTheme.primary : AppTheme.bgCard,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                      color: sel ? AppTheme.primary : Colors.transparent,
                      width: 2),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('$d',
                        style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            color: sel
                                ? Colors.white
                                : AppTheme.textSecondary)),
                    Text('days',
                        style: TextStyle(
                            fontSize: 12,
                            color: sel
                                ? Colors.white70
                                : AppTheme.textSecondary)),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      );

  // ── Page 3: Goal ──────────────────────────────────────────────────────────
  Widget _goalPage() => _Page(
        icon: Icons.track_changes,
        title: 'Your Goal',
        subtitle: 'What are you training for?',
        child: Column(
          children: [
            _GoalCard(
              title: 'Fat Loss', subtitle: 'Burn fat, get lean',
              icon: Icons.local_fire_department, color: AppTheme.error,
              selected: _goal == 'fat_loss',
              onTap: () => setState(() => _goal = 'fat_loss'),
            ),
            const SizedBox(height: 12),
            _GoalCard(
              title: 'Muscle Gain', subtitle: 'Build strength & size',
              icon: Icons.fitness_center, color: AppTheme.primary,
              selected: _goal == 'muscle_gain',
              onTap: () => setState(() => _goal = 'muscle_gain'),
            ),
            const SizedBox(height: 12),
            _GoalCard(
              title: 'Maintain', subtitle: 'Stay fit & healthy',
              icon: Icons.balance, color: AppTheme.accent,
              selected: _goal == 'maintain',
              onTap: () => setState(() => _goal = 'maintain'),
            ),
          ],
        ),
      );

  // ── Page 4: Equipment ─────────────────────────────────────────────────────
  Widget _equipmentPage() => _Page(
        icon: Icons.sports_gymnastics,
        title: 'Equipment',
        subtitle: 'What do you have access to?',
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Wrap(
              spacing: 10, runSpacing: 10,
              children: _equipOptions.map((eq) {
                final sel = _equipment.contains(eq);
                return SelectionChip(
                  label: _equipLabel(eq),
                  selected: sel,
                  onTap: () => setState(() {
                    if (eq == 'none') {
                      _equipment
                        ..clear()
                        ..add('none');
                    } else {
                      _equipment.remove('none');
                      sel ? _equipment.remove(eq) : _equipment.add(eq);
                    }
                  }),
                );
              }).toList(),
            ),
            const SizedBox(height: 20),
            // Custom equipment input
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _customCtrl,
                    style: const TextStyle(color: AppTheme.textPrimary),
                    decoration: const InputDecoration(
                      hintText: 'Add custom equipment...',
                      prefixIcon:
                          Icon(Icons.add, color: AppTheme.primary),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                GestureDetector(
                  onTap: () {
                    final val = _customCtrl.text.trim();
                    if (val.isNotEmpty) {
                      setState(() {
                        _equipment.remove('none');
                        _equipment
                            .add(val.toLowerCase().replaceAll(' ', '_'));
                      });
                      _customCtrl.clear();
                    }
                  },
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppTheme.primary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.check, color: Colors.white),
                  ),
                ),
              ],
            ),
            // Show custom equipment chips
            if (_equipment.any((e) => !_equipOptions.contains(e))) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                children: _equipment
                    .where((e) => !_equipOptions.contains(e))
                    .map((e) => Chip(
                          label: Text(e,
                              style: const TextStyle(
                                  color: Colors.white, fontSize: 12)),
                          backgroundColor:
                              AppTheme.accent.withOpacity(0.3),
                          deleteIcon: const Icon(Icons.close,
                              size: 14, color: AppTheme.accent),
                          onDeleted: () =>
                              setState(() => _equipment.remove(e)),
                        ))
                    .toList(),
              ),
            ],
          ],
        ),
      );

  String _equipLabel(String eq) {
    const map = {
      'dumbbells': 'Dumbbells',
      'barbell': 'Barbell',
      'machines': 'Machines',
      'resistance_bands': 'Resistance Bands',
      'none': 'No Equipment',
    };
    return map[eq] ?? eq;
  }
}

// ── Shared page wrapper ────────────────────────────────────────────────────────
class _Page extends StatelessWidget {
  final IconData icon;
  final String title, subtitle;
  final Widget child;

  const _Page({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.primary.withOpacity(0.15),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: AppTheme.primary, size: 36),
          ),
          const SizedBox(height: 20),
          Text(title, style: Theme.of(context).textTheme.headlineMedium),
          const SizedBox(height: 6),
          Text(subtitle,
              style: Theme.of(context).textTheme.bodyMedium),
          const SizedBox(height: 32),
          child,
        ],
      ),
    );
  }
}

// ── Level card ────────────────────────────────────────────────────────────────
class _LevelCard extends StatelessWidget {
  final String title, subtitle;
  final IconData icon;
  final bool selected;
  final VoidCallback onTap;

  const _LevelCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: selected
              ? AppTheme.primary.withOpacity(0.15)
              : AppTheme.bgCard,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
              color: selected ? AppTheme.primary : Colors.transparent,
              width: 1.5),
        ),
        child: Row(
          children: [
            Icon(icon,
                color: selected
                    ? AppTheme.primary
                    : AppTheme.textSecondary,
                size: 28),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: TextStyle(
                        color: selected
                            ? AppTheme.primary
                            : AppTheme.textPrimary,
                        fontWeight: FontWeight.bold,
                        fontSize: 16)),
                Text(subtitle,
                    style: const TextStyle(
                        color: AppTheme.textSecondary, fontSize: 13)),
              ],
            ),
            const Spacer(),
            if (selected)
              const Icon(Icons.check_circle, color: AppTheme.primary),
          ],
        ),
      ),
    );
  }
}

// ── Goal card ─────────────────────────────────────────────────────────────────
class _GoalCard extends StatelessWidget {
  final String title, subtitle;
  final IconData icon;
  final Color color;
  final bool selected;
  final VoidCallback onTap;

  const _GoalCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: selected ? color.withOpacity(0.15) : AppTheme.bgCard,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
              color: selected ? color : Colors.transparent, width: 1.5),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: TextStyle(
                        color: selected ? color : AppTheme.textPrimary,
                        fontWeight: FontWeight.bold,
                        fontSize: 16)),
                Text(subtitle,
                    style: const TextStyle(
                        color: AppTheme.textSecondary, fontSize: 13)),
              ],
            ),
            const Spacer(),
            if (selected) Icon(Icons.check_circle, color: color),
          ],
        ),
      ),
    );
  }
}
