import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/food_data.dart';
import '../models/calorie_model.dart';
import '../providers/calorie_provider.dart';
import '../providers/workout_provider.dart';
import '../utils/app_theme.dart';

class CalorieTrackerScreen extends StatefulWidget {
  const CalorieTrackerScreen({super.key});

  @override
  State<CalorieTrackerScreen> createState() => _CalorieTrackerScreenState();
}

class _CalorieTrackerScreenState extends State<CalorieTrackerScreen> {
  final _searchCtrl = TextEditingController();
  FoodItem? _selectedFood;
  double _qty = 1; // quantity in servings
  List<FoodItem> _results = FoodData.items;

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  void _addEntry() {
    if (_selectedFood == null) return;
    final cal = _selectedFood!.caloriesForServings(_qty);
    final macros = _selectedFood!.macrosForServings(_qty);
    final qtyLabel = _qty == _qty.truncateToDouble()
        ? _qty.toInt().toString()
        : _qty.toStringAsFixed(1);
    context.read<CalorieProvider>().addEntry(
      '${_selectedFood!.emoji} ${_selectedFood!.name} × $qtyLabel ${_selectedFood!.servingUnit}',
      cal,
      macros,
    );
    setState(() {
      _selectedFood = null;
      _qty = 1;
      _searchCtrl.clear();
      _results = FoodData.items;
    });
    Navigator.pop(context);
  }

  void _showAddSheet() {
    setState(() {
      _results = FoodData.items;
      _searchCtrl.clear();
      _selectedFood = null;
      _qty = 1;
    });

    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.bgCard,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (_) => StatefulBuilder(
        builder: (ctx, ss) {
          // live calorie preview
          final previewCal = _selectedFood != null
              ? _selectedFood!.caloriesForServings(_qty)
              : 0;

          return Padding(
            padding: EdgeInsets.only(
              left: 16, right: 16, top: 16,
              bottom: MediaQuery.of(context).viewInsets.bottom + 20,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // drag handle
                Center(
                  child: Container(
                    width: 36, height: 4,
                    decoration: BoxDecoration(
                      color: AppTheme.textSecondary.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                const Text('Add Food',
                    style: TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 18,
                        fontWeight: FontWeight.bold)),
                const SizedBox(height: 14),

                // ── Search ────────────────────────────────────────────────
                TextField(
                  controller: _searchCtrl,
                  style: const TextStyle(color: AppTheme.textPrimary),
                  onChanged: (q) =>
                      ss(() => _results = FoodData.search(q)),
                  decoration: InputDecoration(
                    hintText: 'Search food (roti, dal, egg...)',
                    prefixIcon:
                        const Icon(Icons.search, color: AppTheme.primary),
                    suffixIcon: _searchCtrl.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear,
                                color: AppTheme.textSecondary, size: 18),
                            onPressed: () {
                              _searchCtrl.clear();
                              ss(() => _results = FoodData.items);
                            })
                        : null,
                  ),
                ),
                const SizedBox(height: 8),

                // ── Food list ─────────────────────────────────────────────
                SizedBox(
                  height: 190,
                  child: ListView.builder(
                    itemCount: _results.length,
                    itemBuilder: (_, i) {
                      final food = _results[i];
                      final sel = _selectedFood?.name == food.name;
                      return InkWell(
                        onTap: () => ss(() {
                          _selectedFood = food;
                          _qty = 1;
                          _results = [];
                          _searchCtrl.text = food.name;
                        }),
                        borderRadius: BorderRadius.circular(10),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 8),
                          margin: const EdgeInsets.only(bottom: 4),
                          decoration: BoxDecoration(
                            color: sel
                                ? AppTheme.primary.withOpacity(0.12)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(
                                color: sel
                                    ? AppTheme.primary.withOpacity(0.4)
                                    : Colors.transparent),
                          ),
                          child: Row(
                            children: [
                              Text(food.emoji,
                                  style: const TextStyle(fontSize: 22)),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Text(food.name,
                                        style: TextStyle(
                                            color: sel
                                                ? AppTheme.primary
                                                : AppTheme.textPrimary,
                                            fontSize: 13,
                                            fontWeight: sel
                                                ? FontWeight.bold
                                                : FontWeight.normal)),
                                    Text(
                                      '1 ${food.servingUnit} = ${food.caloriesForServings(1)} kcal',
                                      style: const TextStyle(
                                          color: AppTheme.textSecondary,
                                          fontSize: 11),
                                    ),
                                  ],
                                ),
                              ),
                              if (sel)
                                const Icon(Icons.check_circle,
                                    color: AppTheme.primary, size: 18),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),

                // ── Quantity picker (shown after food selected) ────────────
                if (_selectedFood != null) ...[
                  const Divider(color: Color(0xFF2A2A3E)),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'How many ${_selectedFood!.servingUnit}?',
                              style: const TextStyle(
                                  color: AppTheme.textSecondary,
                                  fontSize: 12),
                            ),
                            const SizedBox(height: 8),
                            // +/- stepper
                            Row(
                              children: [
                                _QtyBtn(
                                  icon: Icons.remove,
                                  onTap: () => ss(() {
                                    if (_qty > 0.5) _qty -= 0.5;
                                  }),
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  _qty == _qty.truncateToDouble()
                                      ? _qty.toInt().toString()
                                      : _qty.toStringAsFixed(1),
                                  style: const TextStyle(
                                      color: AppTheme.textPrimary,
                                      fontSize: 22,
                                      fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(width: 12),
                                _QtyBtn(
                                  icon: Icons.add,
                                  onTap: () => ss(() => _qty += 0.5),
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  _selectedFood!.servingUnit,
                                  style: const TextStyle(
                                      color: AppTheme.textSecondary,
                                      fontSize: 13),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      // Live calorie preview
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 10),
                        decoration: BoxDecoration(
                          color: AppTheme.primary.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                              color: AppTheme.primary.withOpacity(0.3)),
                        ),
                        child: Column(
                          children: [
                            Text('$previewCal',
                                style: const TextStyle(
                                    color: AppTheme.primary,
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold)),
                            const Text('kcal',
                                style: TextStyle(
                                    color: AppTheme.textSecondary,
                                    fontSize: 11)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _addEntry,
                      child: const Text('Add to Log'),
                    ),
                  ),
                ],
              ],
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final calProv = context.watch<CalorieProvider>();
    final workoutProv = context.watch<WorkoutProvider>();
    final caloriesIn = calProv.todayCaloriesIn;
    final burned = workoutProv.caloriesBurnedToday;
    final net = caloriesIn - burned;
    final macros = calProv.todayMacros;

    return Scaffold(
      appBar: AppBar(title: const Text('Calorie Tracker')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddSheet,
        backgroundColor: AppTheme.primary,
        icon: const Icon(Icons.add),
        label: const Text('Add Food'),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 90),
        children: [
          // ── Intake / Burned ───────────────────────────────────────────────
          Row(
            children: [
              Expanded(child: _CalCard('Intake', caloriesIn,
                  Icons.restaurant, AppTheme.accent)),
              const SizedBox(width: 12),
              Expanded(child: _CalCard('Burned', burned,
                  Icons.local_fire_department, AppTheme.error)),
            ],
          ),
          const SizedBox(height: 12),

          // ── Net calories ──────────────────────────────────────────────────
          _NetCard(net: net),
          const SizedBox(height: 14),

          // ── Macros ────────────────────────────────────────────────────────
          _MacrosCard(macros: macros),
          const SizedBox(height: 22),

          // ── Food log ──────────────────────────────────────────────────────
          const Text("Today's Food Log",
              style: TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),

          if (calProv.todayEntries.isEmpty)
            _EmptyLog()
          else
            ...calProv.todayEntries.reversed.map((entry) => _FoodEntryTile(
                  entry: entry,
                  onDelete: () =>
                      context.read<CalorieProvider>().removeEntry(entry.id),
                )),
        ],
      ),
    );
  }
}

// ── Small widgets ─────────────────────────────────────────────────────────────

class _QtyBtn extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  const _QtyBtn({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        child: Container(
          width: 34, height: 34,
          decoration: BoxDecoration(
            color: AppTheme.primary.withOpacity(0.15),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: AppTheme.primary.withOpacity(0.3)),
          ),
          child: Icon(icon, color: AppTheme.primary, size: 18),
        ),
      );
}

class _CalCard extends StatelessWidget {
  final String label;
  final int value;
  final IconData icon;
  final Color color;
  const _CalCard(this.label, this.value, this.icon, this.color);

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppTheme.bgCard,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 6),
            Text('$value',
                style: TextStyle(
                    color: color, fontSize: 20, fontWeight: FontWeight.bold)),
            Text('$label kcal',
                style: const TextStyle(
                    color: AppTheme.textSecondary, fontSize: 11)),
          ],
        ),
      );
}

class _NetCard extends StatelessWidget {
  final int net;
  const _NetCard({required this.net});

  @override
  Widget build(BuildContext context) {
    final pos = net >= 0;
    final color = pos ? AppTheme.accent : AppTheme.error;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [color.withOpacity(0.15), AppTheme.bgCard],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Net Calories',
                  style: TextStyle(
                      color: AppTheme.textSecondary, fontSize: 12)),
              const SizedBox(height: 2),
              Text('${pos ? '+' : ''}$net kcal',
                  style: TextStyle(
                      color: color,
                      fontSize: 24,
                      fontWeight: FontWeight.bold)),
              Text(pos ? 'Caloric Surplus' : 'Caloric Deficit',
                  style: TextStyle(color: color, fontSize: 12)),
            ],
          ),
          const Spacer(),
          Icon(pos ? Icons.trending_up : Icons.trending_down,
              color: color, size: 40),
        ],
      ),
    );
  }
}

class _MacrosCard extends StatelessWidget {
  final Macros macros;
  const _MacrosCard({required this.macros});

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppTheme.bgCard,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Macros Today',
                style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _MacroItem('Protein',
                    macros.protein, const Color(0xFF2196F3))),
                Expanded(child: _MacroItem('Carbs',
                    macros.carbs, AppTheme.warning)),
                Expanded(child: _MacroItem('Fat',
                    macros.fat, AppTheme.error)),
                Expanded(child: _MacroItem('Fiber',
                    macros.fiber, AppTheme.accent)),
              ],
            ),
          ],
        ),
      );
}

class _MacroItem extends StatelessWidget {
  final String label;
  final double value;
  final Color color;
  const _MacroItem(this.label, this.value, this.color);

  @override
  Widget build(BuildContext context) => Column(
        children: [
          Text('${value.toStringAsFixed(1)}g',
              style: TextStyle(
                  color: color,
                  fontSize: 15,
                  fontWeight: FontWeight.bold)),
          const SizedBox(height: 2),
          Text(label,
              style: const TextStyle(
                  color: AppTheme.textSecondary, fontSize: 11)),
        ],
      );
}

class _EmptyLog extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(28),
        decoration: BoxDecoration(
            color: AppTheme.bgCard,
            borderRadius: BorderRadius.circular(14)),
        child: const Column(
          children: [
            Icon(Icons.restaurant_menu,
                color: AppTheme.textSecondary, size: 44),
            SizedBox(height: 10),
            Text('Nothing logged yet',
                style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontWeight: FontWeight.w600)),
            SizedBox(height: 4),
            Text('Tap + to add your meals',
                style: TextStyle(
                    color: AppTheme.textSecondary, fontSize: 12)),
          ],
        ),
      );
}

class _FoodEntryTile extends StatelessWidget {
  final FoodEntry entry;
  final VoidCallback onDelete;
  const _FoodEntryTile({required this.entry, required this.onDelete});

  @override
  Widget build(BuildContext context) => Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
            color: AppTheme.bgCard,
            borderRadius: BorderRadius.circular(12)),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(7),
              decoration: BoxDecoration(
                color: AppTheme.accent.withOpacity(0.12),
                borderRadius: BorderRadius.circular(9),
              ),
              child: const Icon(Icons.restaurant,
                  color: AppTheme.accent, size: 16),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(entry.name,
                      style: const TextStyle(
                          color: AppTheme.textPrimary,
                          fontWeight: FontWeight.w500,
                          fontSize: 13),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis),
                  Text(
                    'P ${entry.macros.protein.toStringAsFixed(1)}g  '
                    'C ${entry.macros.carbs.toStringAsFixed(1)}g  '
                    'F ${entry.macros.fat.toStringAsFixed(1)}g',
                    style: const TextStyle(
                        color: AppTheme.textSecondary, fontSize: 10),
                  ),
                ],
              ),
            ),
            Text('${entry.calories} kcal',
                style: const TextStyle(
                    color: AppTheme.accent,
                    fontWeight: FontWeight.bold,
                    fontSize: 13)),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: onDelete,
              child: const Icon(Icons.delete_outline,
                  color: AppTheme.textSecondary, size: 18),
            ),
          ],
        ),
      );
}
