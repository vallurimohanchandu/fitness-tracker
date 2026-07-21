import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/user_provider.dart';
import '../providers/workout_provider.dart';
import '../utils/app_theme.dart';
import '../widgets/gradient_button.dart';
import '../widgets/selection_chip.dart';
import 'bmi_screen.dart';
import 'onboarding_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _editing = false;
  late String _level;
  late int _days;
  late String _goal;
  late List<String> _equipment;
  final _nameCtrl = TextEditingController();

  static const _equipOptions = [
    'dumbbells', 'barbell', 'machines', 'resistance_bands', 'none'
  ];

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    super.dispose();
  }

  void _loadUser() {
    final u = context.read<UserProvider>().user;
    _level = u?.experienceLevel ?? 'beginner';
    _days = u?.workoutDaysPerWeek ?? 5;
    _goal = u?.goal ?? 'muscle_gain';
    _equipment = List.from(u?.equipment ?? ['none']);
    _nameCtrl.text = u?.name ?? '';
  }

  Future<void> _save() async {
    final user = context.read<UserProvider>().user;
    if (user == null) return;
    final updated = user.copyWith(
      experienceLevel: _level,
      workoutDaysPerWeek: _days,
      goal: _goal,
      equipment: _equipment,
      name: _nameCtrl.text.trim().isEmpty ? null : _nameCtrl.text.trim(),
    );
    await context.read<UserProvider>().updateUser(updated);
    context.read<WorkoutProvider>().generatePlan(updated);
    setState(() => _editing = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Profile updated & plan regenerated'),
          backgroundColor: AppTheme.accent));
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<UserProvider>().user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          TextButton(
            onPressed: () => setState(() {
              if (_editing) _loadUser(); // cancel resets fields
              _editing = !_editing;
            }),
            child: Text(
              _editing ? 'Cancel' : 'Edit',
              style: const TextStyle(
                  color: AppTheme.primary, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // ── Avatar ────────────────────────────────────────────────────────
          Center(
            child: Column(
              children: [
                Container(
                  width: 90, height: 90,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                        colors: [AppTheme.primary, AppTheme.primaryDark]),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.person,
                      color: Colors.white, size: 48),
                ),
                const SizedBox(height: 12),
                if (_editing)
                  SizedBox(
                    width: 200,
                    child: TextField(
                      controller: _nameCtrl,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                          color: AppTheme.textPrimary,
                          fontSize: 18,
                          fontWeight: FontWeight.bold),
                      decoration:
                          const InputDecoration(hintText: 'Your name'),
                    ),
                  )
                else
                  Text(user?.name ?? 'Athlete',
                      style: const TextStyle(
                          color: AppTheme.textPrimary,
                          fontSize: 22,
                          fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(_goalLabel(user?.goal),
                    style: const TextStyle(
                        color: AppTheme.primary, fontSize: 14)),
              ],
            ),
          ),
          const SizedBox(height: 28),

          // ── Experience level ──────────────────────────────────────────────
          _Label('Experience Level'),
          const SizedBox(height: 10),
          if (_editing)
            Row(
              children: ['beginner', 'intermediate', 'expert']
                  .map((l) => Expanded(
                        child: Padding(
                          padding:
                              const EdgeInsets.symmetric(horizontal: 4),
                          child: SelectionChip(
                            label: l[0].toUpperCase() + l.substring(1),
                            selected: _level == l,
                            onTap: () => setState(() => _level = l),
                          ),
                        ),
                      ))
                  .toList(),
            )
          else
            _InfoRow(Icons.fitness_center, 'Level',
                _level[0].toUpperCase() + _level.substring(1)),

          const SizedBox(height: 16),

          // ── Workout days ──────────────────────────────────────────────────
          _Label('Workout Days / Week'),
          const SizedBox(height: 10),
          if (_editing)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [5, 6, 7].map((d) {
                final sel = _days == d;
                return GestureDetector(
                  onTap: () => setState(() => _days = d),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 70, height: 70,
                    decoration: BoxDecoration(
                      color: sel ? AppTheme.primary : AppTheme.bgCard,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                          color: sel
                              ? AppTheme.primary
                              : Colors.transparent),
                    ),
                    child: Center(
                      child: Text('$d',
                          style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: sel
                                  ? Colors.white
                                  : AppTheme.textSecondary)),
                    ),
                  ),
                );
              }).toList(),
            )
          else
            _InfoRow(Icons.calendar_today, 'Days/Week',
                '${user?.workoutDaysPerWeek} days'),

          const SizedBox(height: 16),

          // ── Goal ──────────────────────────────────────────────────────────
          _Label('Goal'),
          const SizedBox(height: 10),
          if (_editing)
            Wrap(
              spacing: 8,
              children: [
                ('fat_loss', 'Fat Loss', AppTheme.error),
                ('muscle_gain', 'Muscle Gain', AppTheme.primary),
                ('maintain', 'Maintain', AppTheme.accent),
              ]
                  .map((g) => SelectionChip(
                        label: g.$2,
                        selected: _goal == g.$1,
                        onTap: () => setState(() => _goal = g.$1),
                        color: g.$3,
                      ))
                  .toList(),
            )
          else
            _InfoRow(Icons.track_changes, 'Goal',
                _goalLabel(user?.goal)),

          const SizedBox(height: 16),

          // ── Equipment ─────────────────────────────────────────────────────
          _Label('Equipment'),
          const SizedBox(height: 10),
          if (_editing)
            Wrap(
              spacing: 8, runSpacing: 8,
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
                      sel
                          ? _equipment.remove(eq)
                          : _equipment.add(eq);
                    }
                  }),
                );
              }).toList(),
            )
          else
            Wrap(
              spacing: 8, runSpacing: 8,
              children: (user?.equipment ?? [])
                  .map((eq) => Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppTheme.primary.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                              color:
                                  AppTheme.primary.withOpacity(0.3)),
                        ),
                        child: Text(_equipLabel(eq),
                            style: const TextStyle(
                                color: AppTheme.primary,
                                fontSize: 13)),
                      ))
                  .toList(),
            ),

          const SizedBox(height: 24),

          if (_editing)
            GradientButton(label: 'Save Changes', onTap: _save)
          else ...[
            _ActionBtn(
              icon: Icons.monitor_weight_outlined,
              label: 'BMI Calculator',
              onTap: () => Navigator.push(context,
                  MaterialPageRoute(builder: (_) => const BmiScreen())),
            ),
            const SizedBox(height: 12),
            _ActionBtn(
              icon: Icons.refresh,
              label: 'Reset & Redo Onboarding',
              color: AppTheme.error,
              onTap: () => _confirmReset(context),
            ),
          ],
          const SizedBox(height: 80),
        ],
      ),
    );
  }

  void _confirmReset(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: AppTheme.bgCard,
        title: const Text('Reset App',
            style: TextStyle(color: AppTheme.textPrimary)),
        content: const Text('This will clear all your data.',
            style: TextStyle(color: AppTheme.textSecondary)),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel',
                  style: TextStyle(color: AppTheme.textSecondary))),
          TextButton(
            onPressed: () async {
              await context.read<UserProvider>().clearUser();
              if (mounted) {
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(
                      builder: (_) => const OnboardingScreen()),
                  (_) => false,
                );
              }
            },
            child: const Text('Reset',
                style: TextStyle(color: AppTheme.error)),
          ),
        ],
      ),
    );
  }

  String _goalLabel(String? g) {
    const m = {
      'fat_loss': 'Fat Loss',
      'muscle_gain': 'Muscle Gain',
      'maintain': 'Maintain'
    };
    return m[g] ?? 'Training';
  }

  String _equipLabel(String eq) {
    const m = {
      'dumbbells': 'Dumbbells',
      'barbell': 'Barbell',
      'machines': 'Machines',
      'resistance_bands': 'Resistance Bands',
      'none': 'No Equipment',
    };
    return m[eq] ?? eq;
  }
}

class _Label extends StatelessWidget {
  final String text;
  const _Label(this.text);

  @override
  Widget build(BuildContext context) => Text(text,
      style: const TextStyle(
          color: AppTheme.textSecondary,
          fontSize: 12,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.8));
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label, value;
  const _InfoRow(this.icon, this.label, this.value);

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
            color: AppTheme.bgCard,
            borderRadius: BorderRadius.circular(12)),
        child: Row(
          children: [
            Icon(icon, color: AppTheme.primary, size: 20),
            const SizedBox(width: 12),
            Text(label,
                style: const TextStyle(
                    color: AppTheme.textSecondary, fontSize: 13)),
            const Spacer(),
            Text(value,
                style: const TextStyle(
                    color: AppTheme.textPrimary,
                    fontWeight: FontWeight.w600)),
          ],
        ),
      );
}

class _ActionBtn extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color color;

  const _ActionBtn({
    required this.icon,
    required this.label,
    required this.onTap,
    this.color = AppTheme.primary,
  });

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.bgCard,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: color.withOpacity(0.2)),
          ),
          child: Row(
            children: [
              Icon(icon, color: color, size: 22),
              const SizedBox(width: 12),
              Text(label,
                  style: TextStyle(
                      color: color, fontWeight: FontWeight.w500)),
              const Spacer(),
              Icon(Icons.chevron_right,
                  color: color.withOpacity(0.5)),
            ],
          ),
        ),
      );
}
