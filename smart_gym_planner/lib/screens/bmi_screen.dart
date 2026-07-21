import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/calorie_model.dart';
import '../providers/user_provider.dart';
import '../utils/app_theme.dart';
import '../widgets/gradient_button.dart';

class BmiScreen extends StatefulWidget {
  const BmiScreen({super.key});

  @override
  State<BmiScreen> createState() => _BmiScreenState();
}

class _BmiScreenState extends State<BmiScreen> {
  final _hCtrl = TextEditingController();
  final _wCtrl = TextEditingController();
  double? _bmi;
  String _category = '';
  Color _color = AppTheme.accent;
  NutritionTarget? _target;

  @override
  void initState() {
    super.initState();
    final user = context.read<UserProvider>().user;
    if (user?.height != null) _hCtrl.text = user!.height!.toString();
    if (user?.weight != null) _wCtrl.text = user!.weight!.toString();
  }

  @override
  void dispose() {
    _hCtrl.dispose();
    _wCtrl.dispose();
    super.dispose();
  }

  void _calculate() {
    final h = double.tryParse(_hCtrl.text);
    final w = double.tryParse(_wCtrl.text);
    if (h == null || w == null || h <= 0 || w <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Enter valid height and weight'),
          backgroundColor: AppTheme.error));
      return;
    }
    final hm = h / 100;
    final bmi = w / (hm * hm);
    String cat;
    Color col;
    if (bmi < 18.5) { cat = 'Underweight'; col = AppTheme.warning; }
    else if (bmi < 25) { cat = 'Normal'; col = AppTheme.accent; }
    else if (bmi < 30) { cat = 'Overweight'; col = AppTheme.error; }
    else { cat = 'Obese'; col = AppTheme.error; }

    final user = context.read<UserProvider>().user;
    final target = NutritionTarget.calculate(
      weight: w, height: h,
      goal: user?.goal ?? 'maintain',
    );

    setState(() {
      _bmi = bmi;
      _category = cat;
      _color = col;
      _target = target;
    });

    // Persist height/weight to profile
    if (user != null) {
      context.read<UserProvider>().updateUser(user.copyWith(height: h, weight: w));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('BMI & Nutrition')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // ── Input card ────────────────────────────────────────────────
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                  color: AppTheme.bgCard,
                  borderRadius: BorderRadius.circular(20)),
              child: Column(
                children: [
                  TextField(
                    controller: _hCtrl,
                    keyboardType: TextInputType.number,
                    style: const TextStyle(color: AppTheme.textPrimary),
                    decoration: const InputDecoration(
                      labelText: 'Height (cm)',
                      prefixIcon: Icon(Icons.height, color: AppTheme.primary),
                    ),
                  ),
                  const SizedBox(height: 14),
                  TextField(
                    controller: _wCtrl,
                    keyboardType: TextInputType.number,
                    style: const TextStyle(color: AppTheme.textPrimary),
                    decoration: const InputDecoration(
                      labelText: 'Weight (kg)',
                      prefixIcon: Icon(Icons.monitor_weight_outlined,
                          color: AppTheme.primary),
                    ),
                  ),
                  const SizedBox(height: 20),
                  GradientButton(label: 'Calculate BMI & Nutrition', onTap: _calculate),
                ],
              ),
            ),

            if (_bmi != null) ...[
              const SizedBox(height: 20),

              // ── BMI result ────────────────────────────────────────────────
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [_color.withOpacity(0.2), AppTheme.bgCard],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: _color.withOpacity(0.4)),
                ),
                child: Row(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Your BMI',
                            style: TextStyle(
                                color: AppTheme.textSecondary, fontSize: 13)),
                        Text(_bmi!.toStringAsFixed(1),
                            style: TextStyle(
                                color: _color,
                                fontSize: 52,
                                fontWeight: FontWeight.bold)),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 6),
                          decoration: BoxDecoration(
                            color: _color.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(_category,
                              style: TextStyle(
                                  color: _color,
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                    const Spacer(),
                    Icon(Icons.monitor_weight_outlined, color: _color, size: 56),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // ── Nutrition targets ─────────────────────────────────────────
              if (_target != null) _NutritionTargetCard(target: _target!),
              const SizedBox(height: 16),

              // ── Suggestions ───────────────────────────────────────────────
              _SuggestionsCard(category: _category),
              const SizedBox(height: 16),

              // ── BMI scale ─────────────────────────────────────────────────
              _BmiScaleCard(activeCategory: _category),
              const SizedBox(height: 20),
            ],
          ],
        ),
      ),
    );
  }
}

// ── Nutrition target card ──────────────────────────────────────────────────────
class _NutritionTargetCard extends StatelessWidget {
  final NutritionTarget target;
  const _NutritionTargetCard({required this.target});

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: AppTheme.bgCard,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.primary.withOpacity(0.2)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.local_dining, color: AppTheme.primary, size: 18),
                SizedBox(width: 8),
                Text('Daily Nutrition Targets',
                    style: TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 15,
                        fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 16),
            // Calories
            _TargetRow('🔥 Daily Calories', '${target.calories} kcal',
                AppTheme.primary),
            const SizedBox(height: 10),
            // Macros
            Row(
              children: [
                Expanded(child: _MacroTarget('💪 Protein',
                    '${target.protein.toStringAsFixed(0)}g',
                    const Color(0xFF2196F3))),
                Expanded(child: _MacroTarget('🍚 Carbs',
                    '${target.carbs.toStringAsFixed(0)}g',
                    AppTheme.warning)),
                Expanded(child: _MacroTarget('🥑 Fat',
                    '${target.fat.toStringAsFixed(0)}g',
                    AppTheme.error)),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppTheme.primary.withOpacity(0.08),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Text(
                '💡 Protein: 1.6–1.8g per kg body weight for muscle gain. '
                'Adjust carbs based on energy levels.',
                style: TextStyle(
                    color: AppTheme.textSecondary,
                    fontSize: 11,
                    height: 1.5),
              ),
            ),
          ],
        ),
      );
}

class _TargetRow extends StatelessWidget {
  final String label, value;
  final Color color;
  const _TargetRow(this.label, this.value, this.color);

  @override
  Widget build(BuildContext context) => Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: const TextStyle(
                  color: AppTheme.textSecondary, fontSize: 13)),
          Text(value,
              style: TextStyle(
                  color: color,
                  fontSize: 15,
                  fontWeight: FontWeight.bold)),
        ],
      );
}

class _MacroTarget extends StatelessWidget {
  final String label, value;
  final Color color;
  const _MacroTarget(this.label, this.value, this.color);

  @override
  Widget build(BuildContext context) => Column(
        children: [
          Text(value,
              style: TextStyle(
                  color: color,
                  fontSize: 18,
                  fontWeight: FontWeight.bold)),
          Text(label,
              style: const TextStyle(
                  color: AppTheme.textSecondary, fontSize: 10),
              textAlign: TextAlign.center),
        ],
      );
}

// ── Suggestions card ───────────────────────────────────────────────────────────
class _SuggestionsCard extends StatelessWidget {
  final String category;
  const _SuggestionsCard({required this.category});

  List<String> get _tips {
    switch (category) {
      case 'Underweight':
        return [
          'Increase caloric intake with nutrient-dense foods.',
          'Focus on strength training to build muscle mass.',
          'Eat protein-rich meals (eggs, chicken, paneer, dal).',
          'Add healthy fats: ghee, nuts, avocado.',
        ];
      case 'Normal':
        return [
          'Maintain your current healthy lifestyle.',
          'Continue regular exercise (3-5 days/week).',
          'Keep a balanced diet with all macronutrients.',
          'Stay hydrated — 3-4 litres of water daily.',
        ];
      default:
        return [
          'Create a moderate caloric deficit (300-500 kcal/day).',
          'Incorporate cardio alongside strength training.',
          'Reduce processed foods, maida, and added sugars.',
          'Aim for 8,000-10,000 steps daily.',
          'Eat more vegetables, dal, and lean proteins.',
        ];
    }
  }

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
            color: AppTheme.bgCard,
            borderRadius: BorderRadius.circular(16)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.lightbulb_outline,
                    color: AppTheme.primary, size: 18),
                SizedBox(width: 8),
                Text('Suggestions',
                    style: TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 15,
                        fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 12),
            ..._tips.map((t) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.check_circle_outline,
                          color: AppTheme.accent, size: 15),
                      const SizedBox(width: 8),
                      Expanded(
                          child: Text(t,
                              style: const TextStyle(
                                  color: AppTheme.textPrimary,
                                  fontSize: 13,
                                  height: 1.4))),
                    ],
                  ),
                )),
          ],
        ),
      );
}

// ── BMI scale card ─────────────────────────────────────────────────────────────
class _BmiScaleCard extends StatelessWidget {
  final String activeCategory;
  const _BmiScaleCard({required this.activeCategory});

  @override
  Widget build(BuildContext context) {
    final ranges = [
      ('< 18.5', 'Underweight', AppTheme.warning),
      ('18.5–24.9', 'Normal', AppTheme.accent),
      ('25–29.9', 'Overweight', AppTheme.error),
      ('≥ 30', 'Obese', const Color(0xFFB71C1C)),
    ];
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: AppTheme.bgCard,
          borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('BMI Scale',
              style: TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 15,
                  fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          ...ranges.map((r) {
            final active = activeCategory == r.$2;
            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.symmetric(
                  horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: r.$3.withOpacity(active ? 0.2 : 0.05),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                    color: active ? r.$3 : Colors.transparent,
                    width: 1.5),
              ),
              child: Row(
                children: [
                  Text(r.$1,
                      style: TextStyle(
                          color: r.$3,
                          fontWeight: FontWeight.bold,
                          fontSize: 13)),
                  const SizedBox(width: 12),
                  Text(r.$2,
                      style: TextStyle(color: r.$3, fontSize: 13)),
                  const Spacer(),
                  if (active)
                    Icon(Icons.arrow_left, color: r.$3, size: 20),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}
