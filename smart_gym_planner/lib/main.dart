import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'providers/user_provider.dart';
import 'providers/workout_provider.dart';
import 'providers/calorie_provider.dart';
import 'providers/weight_provider.dart';
import 'screens/onboarding_screen.dart';
import 'screens/main_nav_screen.dart';
import 'utils/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  final bool onboardingDone = prefs.getBool('onboarding_done') ?? false;

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
            create: (_) => UserProvider()..loadFromPrefs()),
        ChangeNotifierProvider(create: (_) => WorkoutProvider()),
        ChangeNotifierProvider(
            create: (_) => CalorieProvider()..loadFromPrefs()),
        ChangeNotifierProvider(
            create: (_) => WeightProvider()..loadFromPrefs()),
      ],
      child: SmartGymApp(onboardingDone: onboardingDone),
    ),
  );
}

class SmartGymApp extends StatelessWidget {
  final bool onboardingDone;
  const SmartGymApp({super.key, required this.onboardingDone});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Gym Planner',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: onboardingDone
          ? const MainNavScreen()
          : const OnboardingScreen(),
    );
  }
}
