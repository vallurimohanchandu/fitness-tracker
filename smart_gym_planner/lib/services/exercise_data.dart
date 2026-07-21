import '../models/exercise_model.dart';

/// Full exercise database with real image URLs (Wikimedia / public domain)
class ExerciseData {
  // Using reliable Wikimedia Commons images
  static const String _wiki = 'https://upload.wikimedia.org/wikipedia/commons/thumb';

  static final List<ExerciseModel> allExercises = [
    // ── CHEST ──────────────────────────────────────────────────────────────
    ExerciseModel(
      id: 'c1', name: 'Push-Up', muscleGroup: 'chest', sets: 3, reps: '12-15',
      instructions: 'Start in plank. Lower chest to floor keeping elbows at 45°. Push back up explosively. Keep core tight throughout.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'c2', name: 'Dumbbell Bench Press', muscleGroup: 'chest', sets: 4, reps: '8-12',
      instructions: 'Lie on bench, dumbbells at chest level. Press up until arms extended. Lower slowly with control. Keep feet flat on floor.',
      imageUrl: '$_wiki/a/a7/Bench_press_2.jpg/320px-Bench_press_2.jpg',
      requiredEquipment: ['dumbbells'], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'c3', name: 'Barbell Bench Press', muscleGroup: 'chest', sets: 4, reps: '6-10',
      instructions: 'Grip bar slightly wider than shoulders. Lower to chest, press up powerfully. Arch back slightly, retract shoulder blades.',
      imageUrl: '$_wiki/a/a7/Bench_press_2.jpg/320px-Bench_press_2.jpg',
      requiredEquipment: ['barbell'], difficulty: 'intermediate',
    ),
    ExerciseModel(
      id: 'c4', name: 'Incline Dumbbell Press', muscleGroup: 'chest', sets: 3, reps: '10-12',
      instructions: 'Set bench to 30-45°. Press dumbbells from upper chest. Focus on upper pec contraction. Control the descent.',
      imageUrl: '$_wiki/a/a7/Bench_press_2.jpg/320px-Bench_press_2.jpg',
      requiredEquipment: ['dumbbells'], difficulty: 'intermediate',
    ),
    ExerciseModel(
      id: 'c5', name: 'Cable Chest Fly', muscleGroup: 'chest', sets: 3, reps: '12-15',
      instructions: 'Stand between cables at shoulder height. Bring handles together in arc motion. Squeeze chest at peak contraction.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['machines'], difficulty: 'intermediate',
    ),
    ExerciseModel(
      id: 'c6', name: 'Decline Barbell Press', muscleGroup: 'chest', sets: 4, reps: '6-8',
      instructions: 'Lie on decline bench. Lower bar to lower chest. Press up with full extension. Targets lower pecs.',
      imageUrl: '$_wiki/a/a7/Bench_press_2.jpg/320px-Bench_press_2.jpg',
      requiredEquipment: ['barbell'], difficulty: 'expert',
    ),

    // ── TRICEPS ────────────────────────────────────────────────────────────
    ExerciseModel(
      id: 't1', name: 'Tricep Dips', muscleGroup: 'triceps', sets: 3, reps: '10-15',
      instructions: 'Use parallel bars or chair. Lower body bending elbows to 90°. Push back up. Keep elbows close to body.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 't2', name: 'Overhead Tricep Extension', muscleGroup: 'triceps', sets: 3, reps: '12-15',
      instructions: 'Hold dumbbell overhead with both hands. Lower behind head bending elbows. Extend back up. Keep upper arms still.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['dumbbells'], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 't3', name: 'Skull Crushers', muscleGroup: 'triceps', sets: 4, reps: '8-12',
      instructions: 'Lie on bench with barbell. Lower bar toward forehead bending elbows. Extend back up. Keep upper arms vertical.',
      imageUrl: '$_wiki/a/a7/Bench_press_2.jpg/320px-Bench_press_2.jpg',
      requiredEquipment: ['barbell'], difficulty: 'intermediate',
    ),
    ExerciseModel(
      id: 't4', name: 'Cable Pushdown', muscleGroup: 'triceps', sets: 3, reps: '12-15',
      instructions: 'Stand at cable machine. Push bar down until arms fully extended. Control the return. Keep elbows at sides.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['machines'], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 't5', name: 'Close-Grip Bench Press', muscleGroup: 'triceps', sets: 4, reps: '6-10',
      instructions: 'Grip bar shoulder-width. Lower to chest, press up focusing on tricep contraction. Elbows stay close to torso.',
      imageUrl: '$_wiki/a/a7/Bench_press_2.jpg/320px-Bench_press_2.jpg',
      requiredEquipment: ['barbell'], difficulty: 'expert',
    ),

    // ── BACK ───────────────────────────────────────────────────────────────
    ExerciseModel(
      id: 'b1', name: 'Pull-Up', muscleGroup: 'back', sets: 3, reps: '6-10',
      instructions: 'Hang from bar overhand grip. Pull chest to bar squeezing lats. Lower slowly. Full range of motion.',
      imageUrl: '$_wiki/b/b5/Pullup_-_2009_04_21.jpg/320px-Pullup_-_2009_04_21.jpg',
      requiredEquipment: [], difficulty: 'intermediate',
    ),
    ExerciseModel(
      id: 'b2', name: 'Dumbbell Row', muscleGroup: 'back', sets: 4, reps: '10-12',
      instructions: 'Knee on bench. Pull dumbbell to hip, elbow close to body. Squeeze at top. Keep back flat and parallel to floor.',
      imageUrl: '$_wiki/b/b5/Pullup_-_2009_04_21.jpg/320px-Pullup_-_2009_04_21.jpg',
      requiredEquipment: ['dumbbells'], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'b3', name: 'Barbell Deadlift', muscleGroup: 'back', sets: 4, reps: '5-8',
      instructions: 'Stand over bar hip-width. Hinge at hips, grip bar. Drive through heels to stand. Keep back neutral throughout.',
      imageUrl: '$_wiki/b/b5/Pullup_-_2009_04_21.jpg/320px-Pullup_-_2009_04_21.jpg',
      requiredEquipment: ['barbell'], difficulty: 'intermediate',
    ),
    ExerciseModel(
      id: 'b4', name: 'Lat Pulldown', muscleGroup: 'back', sets: 4, reps: '10-12',
      instructions: 'Grip bar wide. Pull to upper chest, elbows pointing down. Squeeze lats at bottom. Lean back slightly.',
      imageUrl: '$_wiki/b/b5/Pullup_-_2009_04_21.jpg/320px-Pullup_-_2009_04_21.jpg',
      requiredEquipment: ['machines'], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'b5', name: 'Resistance Band Row', muscleGroup: 'back', sets: 3, reps: '12-15',
      instructions: 'Anchor band at waist height. Pull handles to sides squeezing shoulder blades. Control the return.',
      imageUrl: '$_wiki/b/b5/Pullup_-_2009_04_21.jpg/320px-Pullup_-_2009_04_21.jpg',
      requiredEquipment: ['resistance_bands'], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'b6', name: 'T-Bar Row', muscleGroup: 'back', sets: 4, reps: '8-10',
      instructions: 'Straddle bar, hinge forward 45°. Pull bar to chest with elbows wide. Squeeze shoulder blades. Control descent.',
      imageUrl: '$_wiki/b/b5/Pullup_-_2009_04_21.jpg/320px-Pullup_-_2009_04_21.jpg',
      requiredEquipment: ['barbell'], difficulty: 'expert',
    ),

    // ── BICEPS ─────────────────────────────────────────────────────────────
    ExerciseModel(
      id: 'bi1', name: 'Dumbbell Curl', muscleGroup: 'biceps', sets: 3, reps: '10-12',
      instructions: 'Stand with dumbbells at sides. Curl up rotating wrist. Squeeze at top, lower slowly. No swinging.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['dumbbells'], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'bi2', name: 'Barbell Curl', muscleGroup: 'biceps', sets: 4, reps: '8-12',
      instructions: 'Grip bar shoulder-width underhand. Curl to shoulder height. Lower with control. Keep elbows pinned to sides.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['barbell'], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'bi3', name: 'Hammer Curl', muscleGroup: 'biceps', sets: 3, reps: '10-12',
      instructions: 'Hold dumbbells neutral grip (thumbs up). Curl up without rotating wrist. Targets brachialis and brachioradialis.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['dumbbells'], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'bi4', name: 'Resistance Band Curl', muscleGroup: 'biceps', sets: 3, reps: '15',
      instructions: 'Stand on band. Curl handles up to shoulders. Squeeze and lower slowly. Constant tension throughout.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['resistance_bands'], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'bi5', name: 'Concentration Curl', muscleGroup: 'biceps', sets: 3, reps: '12',
      instructions: 'Sit on bench, elbow on inner thigh. Curl dumbbell up slowly. Full range of motion. Peak contraction at top.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['dumbbells'], difficulty: 'intermediate',
    ),

    // ── LEGS ───────────────────────────────────────────────────────────────
    ExerciseModel(
      id: 'l1', name: 'Bodyweight Squat', muscleGroup: 'legs', sets: 3, reps: '15-20',
      instructions: 'Feet shoulder-width. Lower until thighs parallel. Drive through heels to stand. Keep chest up and knees tracking toes.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'l2', name: 'Dumbbell Lunge', muscleGroup: 'legs', sets: 3, reps: '10 each',
      instructions: 'Hold dumbbells at sides. Step forward, lower back knee toward floor. Push back up. Alternate legs.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['dumbbells'], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'l3', name: 'Barbell Squat', muscleGroup: 'legs', sets: 4, reps: '6-10',
      instructions: 'Bar on upper traps. Squat to parallel keeping chest up. Drive through heels. Knees track over toes.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['barbell'], difficulty: 'intermediate',
    ),
    ExerciseModel(
      id: 'l4', name: 'Leg Press', muscleGroup: 'legs', sets: 4, reps: '10-15',
      instructions: 'Sit in machine, feet shoulder-width on platform. Press until legs nearly straight. Do not lock knees.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['machines'], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'l5', name: 'Romanian Deadlift', muscleGroup: 'legs', sets: 3, reps: '10-12',
      instructions: 'Hold bar at hips. Hinge forward keeping back flat, feel hamstring stretch. Drive hips forward to stand.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['barbell'], difficulty: 'intermediate',
    ),
    ExerciseModel(
      id: 'l6', name: 'Bulgarian Split Squat', muscleGroup: 'legs', sets: 3, reps: '8-10 each',
      instructions: 'Rear foot elevated on bench. Lower front knee toward floor. Keep torso upright. Powerful drive through front heel.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['dumbbells'], difficulty: 'expert',
    ),

    // ── SHOULDERS ──────────────────────────────────────────────────────────
    ExerciseModel(
      id: 's1', name: 'Pike Push-Up', muscleGroup: 'shoulders', sets: 3, reps: '10-12',
      instructions: 'Form inverted V with hips high. Lower head toward floor, push back up. Targets anterior deltoid.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 's2', name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', sets: 4, reps: '8-12',
      instructions: 'Hold dumbbells at shoulder height. Press overhead until arms extended. Lower slowly. Keep core braced.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['dumbbells'], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 's3', name: 'Barbell Overhead Press', muscleGroup: 'shoulders', sets: 4, reps: '6-10',
      instructions: 'Grip bar slightly wider than shoulders. Press overhead, lock out arms. Lower to chin. Keep core tight.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['barbell'], difficulty: 'intermediate',
    ),
    ExerciseModel(
      id: 's4', name: 'Lateral Raise', muscleGroup: 'shoulders', sets: 3, reps: '12-15',
      instructions: 'Hold dumbbells at sides. Raise arms to shoulder height with slight elbow bend. Control the descent.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['dumbbells'], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 's5', name: 'Face Pull', muscleGroup: 'shoulders', sets: 3, reps: '15',
      instructions: 'Set cable at face height. Pull rope to face, elbows high. Squeeze rear delts. Great for shoulder health.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['machines'], difficulty: 'intermediate',
    ),

    // ── FOREARMS ───────────────────────────────────────────────────────────
    ExerciseModel(
      id: 'f1', name: 'Wrist Curl', muscleGroup: 'forearms', sets: 3, reps: '15-20',
      instructions: 'Rest forearms on bench, palms up. Curl wrists up, lower slowly. Full range of motion.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['dumbbells'], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'f2', name: 'Reverse Wrist Curl', muscleGroup: 'forearms', sets: 3, reps: '15',
      instructions: 'Rest forearms on bench, palms down. Curl wrists up against gravity. Targets extensor muscles.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: ['dumbbells'], difficulty: 'beginner',
    ),

    // ── CORE ───────────────────────────────────────────────────────────────
    ExerciseModel(
      id: 'co1', name: 'Plank', muscleGroup: 'core', sets: 3, reps: '30-60 sec',
      instructions: 'Forearms on floor, body straight. Hold position. Keep hips level, breathe steadily. Do not let hips sag.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'co2', name: 'Crunches', muscleGroup: 'core', sets: 3, reps: '20',
      instructions: 'Lie on back, knees bent. Curl shoulders toward knees. Squeeze abs at top. Lower slowly.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'co3', name: 'Leg Raises', muscleGroup: 'core', sets: 3, reps: '15',
      instructions: 'Lie flat, hands under hips. Raise legs to 90°. Lower slowly without touching floor. Targets lower abs.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'intermediate',
    ),
  ];

  // ── CARDIO (added to every day) ───────────────────────────────────────────
  static final List<ExerciseModel> cardioExercises = [
    ExerciseModel(
      id: 'card1', name: 'Treadmill / Brisk Walk', muscleGroup: 'cardio',
      sets: 1, reps: '10-15 min',
      instructions: 'Walk at 5-6 km/h or jog at 8-10 km/h. Maintain steady pace. Keep heart rate at 60-70% max.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'card2', name: 'Jump Rope', muscleGroup: 'cardio',
      sets: 3, reps: '3 min',
      instructions: 'Jump rope at moderate pace. Land softly on balls of feet. Great for warm-up and cardio conditioning.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
  ];

  // ── WARM-UP ───────────────────────────────────────────────────────────────
  static final List<ExerciseModel> warmupExercises = [
    ExerciseModel(
      id: 'w1', name: 'Jumping Jacks', muscleGroup: 'full_body',
      sets: 2, reps: '30 sec',
      instructions: 'Jump feet out while raising arms overhead. Return to start. Keep rhythm steady.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'w2', name: 'Arm Circles', muscleGroup: 'shoulders',
      sets: 2, reps: '20 each direction',
      instructions: 'Extend arms to sides. Make small circles, gradually increasing size. Loosen shoulder joints.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'w3', name: 'Hip Circles', muscleGroup: 'legs',
      sets: 2, reps: '10 each direction',
      instructions: 'Hands on hips. Rotate hips in large circles to loosen hip flexors and lower back.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'w4', name: 'High Knees', muscleGroup: 'full_body',
      sets: 2, reps: '30 sec',
      instructions: 'Run in place bringing knees to hip height. Pump arms for balance. Elevates heart rate.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
  ];

  // ── STRETCHING ────────────────────────────────────────────────────────────
  static final List<ExerciseModel> stretchingExercises = [
    ExerciseModel(
      id: 'st1', name: 'Chest Stretch', muscleGroup: 'chest',
      sets: 1, reps: '30 sec hold',
      instructions: 'Clasp hands behind back. Squeeze shoulder blades, lift chest. Hold and breathe.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'st2', name: 'Hamstring Stretch', muscleGroup: 'legs',
      sets: 1, reps: '30 sec each',
      instructions: 'Sit on floor, legs extended. Reach toward toes keeping back flat. Feel stretch in hamstrings.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'st3', name: 'Shoulder Cross Stretch', muscleGroup: 'shoulders',
      sets: 1, reps: '30 sec each',
      instructions: 'Pull one arm across chest with opposite hand. Feel stretch in rear deltoid.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'st4', name: 'Quad Stretch', muscleGroup: 'legs',
      sets: 1, reps: '30 sec each',
      instructions: 'Stand on one leg, pull other foot to glute. Keep knees together. Use wall for balance.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
    ExerciseModel(
      id: 'st5', name: "Child's Pose", muscleGroup: 'back',
      sets: 1, reps: '60 sec',
      instructions: 'Kneel, sit back on heels, extend arms forward on floor. Breathe deeply. Releases lower back.',
      imageUrl: '$_wiki/e/ef/Push_up.jpg/320px-Push_up.jpg',
      requiredEquipment: [], difficulty: 'beginner',
    ),
  ];
}
