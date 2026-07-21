import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/weight_model.dart';
import '../providers/weight_provider.dart';
import '../utils/app_theme.dart';

class WeightProgressScreen extends StatefulWidget {
  const WeightProgressScreen({super.key});

  @override
  State<WeightProgressScreen> createState() => _WeightProgressScreenState();
}

class _WeightProgressScreenState extends State<WeightProgressScreen> {
  final _formKey = GlobalKey<FormState>();
  final _weightController = TextEditingController();
  final _noteController = TextEditingController();

  @override
  void dispose() {
    _weightController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  void _showLogWeightSheet(BuildContext context, WeightProvider weightProv) {
    final latestWeight = weightProv.latest?.weight;
    if (latestWeight != null) {
      _weightController.text = latestWeight.toString();
    } else {
      _weightController.clear();
    }
    _noteController.clear();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: Container(
          decoration: const BoxDecoration(
            color: AppTheme.bgCard,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Log Today\'s Weight',
                      style: TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.textSecondary),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                TextFormField(
                  controller: _weightController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  style: const TextStyle(color: AppTheme.textPrimary, fontSize: 18),
                  decoration: const InputDecoration(
                    labelText: 'Weight (kg)',
                    hintText: 'e.g., 75.5',
                    prefixIcon: Icon(Icons.monitor_weight_outlined, color: AppTheme.primary),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter a weight';
                    }
                    final n = double.tryParse(value);
                    if (n == null || n <= 0) {
                      return 'Please enter a valid positive number';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _noteController,
                  maxLines: 2,
                  style: const TextStyle(color: AppTheme.textPrimary),
                  decoration: const InputDecoration(
                    labelText: 'Notes (optional)',
                    hintText: 'e.g., Felt lighter today, fasted state',
                    prefixIcon: Icon(Icons.edit_note_outlined, color: AppTheme.primary),
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () async {
                    if (_formKey.currentState!.validate()) {
                      final w = double.parse(_weightController.text);
                      final note = _noteController.text.trim();
                      await weightProv.addEntry(w, note: note.isEmpty ? null : note);
                      if (mounted) {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Weight logged successfully!'),
                            backgroundColor: AppTheme.success,
                          ),
                        );
                      }
                    }
                  },
                  child: const Text('Save Entry'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    final now = DateTime.now();
    if (date.year == now.year && date.month == now.month && date.day == now.day) {
      return 'Today';
    }
    final yesterday = now.subtract(const Duration(days: 1));
    if (date.year == yesterday.year && date.month == yesterday.month && date.day == yesterday.day) {
      return 'Yesterday';
    }
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    final weightProv = context.watch<WeightProvider>();
    final entries = weightProv.sorted; // Oldest -> Newest
    final displayEntries = entries.reversed.toList(); // Newest -> Oldest

    final latest = weightProv.latest;
    final earliest = weightProv.earliest;
    final change = weightProv.totalChange;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Weight Tracker'),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          children: [
            // ── Summary Cards Row ──
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.bgCard,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.primary.withOpacity(0.15)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Current Weight',
                          style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          latest != null ? '${latest.weight.toStringAsFixed(1)} kg' : '--',
                          style: const TextStyle(
                            color: AppTheme.textPrimary,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.bgCard,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.accent.withOpacity(0.15)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Total Change',
                          style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            Icon(
                              change == null
                                  ? Icons.remove
                                  : change < 0
                                      ? Icons.arrow_downward
                                      : Icons.arrow_upward,
                              color: change == null
                                  ? AppTheme.textSecondary
                                  : change < 0
                                      ? AppTheme.success
                                      : AppTheme.warning,
                              size: 20,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              change != null
                                  ? '${change.abs().toStringAsFixed(1)} kg'
                                  : '--',
                              style: TextStyle(
                                color: change == null
                                    ? AppTheme.textPrimary
                                    : change < 0
                                        ? AppTheme.success
                                        : AppTheme.warning,
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Starting / Earliest weight details
            if (earliest != null && latest != null && earliest.id != latest.id)
              Container(
                margin: const EdgeInsets.only(bottom: 24),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: AppTheme.bgCard2,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Starting: ${earliest.weight.toStringAsFixed(1)} kg (${_formatDate(earliest.date)})',
                      style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                    ),
                    const Icon(Icons.flag_outlined, color: AppTheme.primary, size: 18),
                  ],
                ),
              ),

            // ── Chart Section ──
            const Text(
              'Weight Trend',
              style: TextStyle(
                color: AppTheme.textPrimary,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              height: 200,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.bgCard,
                borderRadius: BorderRadius.circular(20),
              ),
              child: entries.length < 2
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.show_chart, color: AppTheme.textSecondary.withOpacity(0.5), size: 40),
                          const SizedBox(height: 8),
                          const Text(
                            'Need at least 2 entries to display chart',
                            style: TextStyle(color: AppTheme.textSecondary, fontSize: 14),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    )
                  : CustomPaint(
                      painter: WeightChartPainter(entries),
                      child: Container(),
                    ),
            ),
            const SizedBox(height: 28),

            // ── History List Section ──
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Log History',
                  style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (weightProv.loggedToday)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.success.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.check_circle_outline, color: AppTheme.success, size: 14),
                        SizedBox(width: 4),
                        Text(
                          'Logged Today',
                          style: TextStyle(color: AppTheme.success, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 12),

            if (displayEntries.isEmpty)
              Container(
                padding: const EdgeInsets.symmetric(vertical: 40),
                child: const Center(
                  child: Text(
                    'No weight entries recorded yet.',
                    style: TextStyle(color: AppTheme.textSecondary, fontSize: 14),
                  ),
                ),
              )
            else
              ...displayEntries.map((entry) {
                return Card(
                  margin: const EdgeInsets.only(bottom: 10),
                  color: AppTheme.bgCard2,
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    title: Row(
                      children: [
                        Text(
                          '${entry.weight.toStringAsFixed(1)} kg',
                          style: const TextStyle(
                            color: AppTheme.textPrimary,
                            fontWeight: FontWeight.bold,
                            fontSize: 17,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          _formatDate(entry.date),
                          style: const TextStyle(
                            color: AppTheme.textSecondary,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                    subtitle: entry.note != null && entry.note!.isNotEmpty
                        ? Padding(
                            padding: const EdgeInsets.only(top: 6.0),
                            child: Text(
                              entry.note!,
                              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                            ),
                          )
                        : null,
                    trailing: IconButton(
                      icon: const Icon(Icons.delete_outline, color: AppTheme.error, size: 20),
                      onPressed: () => _confirmDelete(context, weightProv, entry),
                    ),
                  ),
                );
              }),
            const SizedBox(height: 80),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.primary,
        onPressed: () => _showLogWeightSheet(context, weightProv),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Log Weight', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  void _confirmDelete(BuildContext context, WeightProvider weightProv, WeightEntry entry) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.bgCard,
        title: const Text('Delete Entry'),
        content: Text('Are you sure you want to delete this weight entry (${entry.weight} kg)?'),
        actions: [
          TextButton(
            child: const Text('Cancel', style: TextStyle(color: AppTheme.textSecondary)),
            onPressed: () => Navigator.pop(context),
          ),
          TextButton(
            child: const Text('Delete', style: TextStyle(color: AppTheme.error)),
            onPressed: () async {
              await weightProv.removeEntry(entry.id);
              if (context.mounted) {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Entry deleted.'),
                    backgroundColor: AppTheme.error,
                  ),
                );
              }
            },
          ),
        ],
      ),
    );
  }
}

class WeightChartPainter extends CustomPainter {
  final List<WeightEntry> entries;
  WeightChartPainter(this.entries);

  @override
  void paint(Canvas canvas, Size size) {
    if (entries.length < 2) return;

    final paintLine = Paint()
      ..color = AppTheme.primary
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0
      ..strokeCap = StrokeCap.round;

    final paintFill = Paint()..style = PaintingStyle.fill;

    // Find min/max weight
    double minW = entries.first.weight;
    double maxW = entries.first.weight;
    for (var entry in entries) {
      if (entry.weight < minW) minW = entry.weight;
      if (entry.weight > maxW) maxW = entry.weight;
    }

    // Add some padding to min/max
    final range = maxW - minW;
    final padding = range == 0 ? 2.0 : range * 0.15;
    minW -= padding;
    maxW += padding;

    final double width = size.width;
    final double height = size.height;

    final double stepX = width / (entries.length - 1);

    final path = Path();
    final fillPath = Path();

    // Map entry to point
    Offset getOffset(int index) {
      final entry = entries[index];
      final x = index * stepX;
      final percentY = (entry.weight - minW) / (maxW - minW);
      final y = height - (percentY * height);
      return Offset(x, y);
    }

    // Draw horizontal grid lines
    final paintGrid = Paint()
      ..color = AppTheme.textSecondary.withOpacity(0.1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;
    
    // Draw 3 grid lines
    for (int i = 0; i < 4; i++) {
      final y = (height / 3) * i;
      canvas.drawLine(Offset(0, y), Offset(width, y), paintGrid);
    }

    final startPoint = getOffset(0);
    path.moveTo(startPoint.dx, startPoint.dy);
    fillPath.moveTo(startPoint.dx, height);
    fillPath.lineTo(startPoint.dx, startPoint.dy);

    for (int i = 1; i < entries.length; i++) {
      final p = getOffset(i);
      final prev = getOffset(i - 1);
      final controlX1 = prev.dx + (p.dx - prev.dx) / 2;
      final controlY1 = prev.dy;
      final controlX2 = prev.dx + (p.dx - prev.dx) / 2;
      final controlY2 = p.dy;

      path.cubicTo(controlX1, controlY1, controlX2, controlY2, p.dx, p.dy);
      fillPath.cubicTo(controlX1, controlY1, controlX2, controlY2, p.dx, p.dy);
    }

    fillPath.lineTo(width, height);
    fillPath.close();

    // Fill gradient
    final fillGradient = LinearGradient(
      colors: [
        AppTheme.primary.withOpacity(0.4),
        AppTheme.primary.withOpacity(0.0),
      ],
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
    );
    paintFill.shader = fillGradient.createShader(Rect.fromLTWH(0, 0, width, height));
    canvas.drawPath(fillPath, paintFill);

    // Draw line
    canvas.drawPath(path, paintLine);

    // Draw dots
    final paintDotOuter = Paint()
      ..color = AppTheme.bgDark
      ..style = PaintingStyle.fill;
    final paintDotInner = Paint()
      ..color = AppTheme.primary
      ..style = PaintingStyle.fill;

    for (int i = 0; i < entries.length; i++) {
      final p = getOffset(i);
      canvas.drawCircle(p, 6.0, paintDotInner);
      canvas.drawCircle(p, 3.0, paintDotOuter);
    }
  }

  @override
  bool shouldRepaint(covariant WeightChartPainter oldDelegate) {
    return oldDelegate.entries != entries;
  }
}