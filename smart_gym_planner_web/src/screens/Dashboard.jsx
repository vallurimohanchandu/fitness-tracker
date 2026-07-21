import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import WeightChart from '../components/WeightChart';
import { achievementsList } from '../data/achievements';
import { Flame, Utensils, Scale, Dumbbell, Award, ArrowDown, ArrowUp, Sparkles, Trophy, Lock, X } from 'lucide-react';

export default function Dashboard({ setActiveTab, onOpenWeightModal, onOpenCalorieModal }) {
  const {
    user,
    workoutPlan,
    caloriesBurnedToday,
    latestWeight,
    totalWeightChange,
    caloriesConsumedToday,
    nutritionTarget,
    sortedWeightEntries,
    calorieHistory,
    unlockedAchievements,
    currentStreak
  } = useApp();

  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Find today's workout split
  const getTodayWorkout = () => {
    if (!workoutPlan) return null;
    const incomplete = workoutPlan.days.find(d => !d.isCompleted);
    return incomplete || workoutPlan.days[workoutPlan.days.length - 1];
  };

  const todayWorkout = getTodayWorkout();
  const calPercent = Math.min(100, (caloriesConsumedToday / nutritionTarget.calories) * 100);

  // Completed workouts count
  const completedWorkouts = workoutPlan ? workoutPlan.days.filter(d => d.isCompleted).length : 0;
  const totalWorkouts = workoutPlan ? workoutPlan.days.length : 0;
  const workoutProgressPercent = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;

  // Max calorie calculation for chart scaling
  const maxCalInHistory = Math.max(...calorieHistory.map(h => h.caloriesIn), 1500);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '30px' }}>
      {/* Header Panel */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {getGreeting()}, {user?.name || 'Athlete'} <SparkleIcon />
            {currentStreak > 0 && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginLeft: '8px',
                color: '#ff9800',
                background: 'rgba(255, 152, 0, 0.1)',
                border: '1px solid rgba(255, 152, 0, 0.25)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <Flame size={14} fill="#ff9800" stroke="none" /> {currentStreak} Day Streak
              </span>
            )}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Here is your fitness dashboard for today. Keep crushing goals!
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            className="secondary" 
            style={{ gap: '6px', padding: '8px 16px', fontSize: '12px', borderRadius: '20px', fontWeight: '700' }}
            onClick={() => setIsAchievementsOpen(true)}
          >
            <Trophy size={14} style={{ color: 'gold' }} /> Badges ({unlockedAchievements.length} / 5)
          </button>
          <div style={{
            background: 'rgba(255, 107, 53, 0.1)',
            border: '1px solid rgba(255, 107, 53, 0.2)',
            color: 'var(--primary)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {user?.experienceLevel}
          </div>
          <div style={{
            background: 'rgba(0, 212, 170, 0.1)',
            border: '1px solid rgba(0, 212, 170, 0.2)',
            color: 'var(--accent)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {user?.goal?.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Overview Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        {/* Calorie Stats */}
        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('calorie')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Nutrition</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(0, 212, 170, 0.1)', color: 'var(--accent)' }}>
              <Utensils size={18} />
            </div>
          </div>
          <h3 style={{ fontSize: '26px', color: '#fff', marginBottom: '6px' }}>
            {caloriesConsumedToday} <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>/ {nutritionTarget.calories} kcal</span>
          </h3>
          <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ width: `${calPercent}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: '10px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>Consumed Today</span>
            <span>{Math.round(calPercent)}% Target</span>
          </div>
        </div>

        {/* Workout Progress */}
        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('workout')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Workout</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255, 107, 53, 0.1)', color: 'var(--primary)' }}>
              <Dumbbell size={18} />
            </div>
          </div>
          <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {todayWorkout ? todayWorkout.splitName : 'Rest Day'}
          </h3>
          <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ width: `${workoutProgressPercent}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '10px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>{todayWorkout?.isCompleted ? 'Workout Completed' : `${completedWorkouts}/${totalWorkouts} Done This Week`}</span>
            <span>{caloriesBurnedToday} kcal burned</span>
          </div>
        </div>

        {/* Weight Tracker Teaser */}
        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('progress')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Body Weight</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>
              <Scale size={18} />
            </div>
          </div>
          <h3 style={{ fontSize: '26px', color: '#fff', marginBottom: '6px' }}>
            {latestWeight ? `${latestWeight.weight.toFixed(1)}` : '--'} <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>kg</span>
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
            {totalWeightChange === null ? (
              <span style={{ color: 'var(--text-muted)' }}>No trend yet</span>
            ) : totalWeightChange < 0 ? (
              <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <ArrowDown size={14} style={{ marginRight: '2px' }} /> {Math.abs(totalWeightChange).toFixed(1)} kg overall
              </span>
            ) : (
              <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <ArrowUp size={14} style={{ marginRight: '2px' }} /> +{totalWeightChange.toFixed(1)} kg overall
              </span>
            )}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            {latestWeight ? 'Last logged: ' + new Date(latestWeight.date).toLocaleDateString() : 'Log your daily weight'}
          </div>
        </div>
      </div>

      {/* Main Grid: Chart and Calorie History */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        marginBottom: '28px',
        alignItems: 'stretch'
      }}>
        {/* Weight trend chart card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Weight Trend Analysis</h3>
            <button 
              className="secondary" 
              style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '8px' }}
              onClick={onOpenWeightModal}
            >
              Log Weight
            </button>
          </div>
          <div style={{ flex: 1, minHeight: '180px' }}>
            <WeightChart entries={sortedWeightEntries} />
          </div>
        </div>

        {/* Calorie History Chart */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Calorie History</h3>
            <button 
              className="secondary" 
              style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '8px' }}
              onClick={onOpenCalorieModal}
            >
              Log Meal
            </button>
          </div>
          
          {/* Calorie Bars */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            height: '130px',
            marginTop: '10px',
            gap: '8px'
          }}>
            {calorieHistory.map((day, idx) => {
              const heightH = maxCalInHistory > 0 ? (day.caloriesIn / maxCalInHistory) * 90 : 4;
              const isToday = idx === 6;

              return (
                <div key={day.date} style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                    {day.caloriesIn > 0 ? day.caloriesIn : ''}
                  </span>
                  <div style={{
                    width: '100%',
                    height: `${Math.max(4, heightH)}px`,
                    background: isToday ? 'var(--primary-gradient)' : 'rgba(0, 212, 170, 0.4)',
                    borderRadius: '4px',
                    transition: 'height 0.3s ease'
                  }} />
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: isToday ? 'bold' : 'normal',
                    color: isToday ? 'var(--primary)' : 'var(--text-secondary)'
                  }}>
                    {day.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Schedule Card */}
      <div className="glass-card" style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Today's Workout Plan</h3>
        {todayWorkout ? (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h4 style={{ fontSize: '16px', color: 'var(--primary)' }}>{todayWorkout.dayName} • {todayWorkout.splitName}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                Contains {todayWorkout.exercises.length} main exercises. Est. burn: {todayWorkout.estimatedCalories} kcal.
              </p>
            </div>
            {todayWorkout.isCompleted ? (
              <div style={{
                background: 'var(--success-glow)',
                border: '1px solid var(--success)',
                color: 'var(--success)',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Award size={18} /> Completed
              </div>
            ) : (
              <button onClick={() => setActiveTab('workout')}>
                Start Workout
              </button>
            )}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
            No workouts scheduled today. Enjoy your rest day!
          </div>
        )}
      </div>

      {/* Sliding side drawer for Achievements */}
      {isAchievementsOpen && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setIsAchievementsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 999,
              animation: 'fadeIn var(--transition-fast) forwards'
            }}
          />
          {/* Drawer Container */}
          <div className="animate-slide-up" style={{
            position: 'fixed',
            right: 0,
            top: 0,
            height: '100%',
            width: '100%',
            maxWidth: '420px',
            background: 'var(--bg-card-solid)',
            borderLeft: '1px solid var(--border-color)',
            zIndex: 1000,
            boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.6)',
            padding: '32px 24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Trophy size={24} style={{ color: 'gold' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Your Achievements</h3>
              </div>
              <button 
                className="secondary" 
                style={{ padding: '8px', minWidth: 'auto', borderRadius: '50%' }}
                onClick={() => setIsAchievementsOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Progress indicator */}
            <div style={{
              background: 'var(--bg-dark)',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>BADGES UNLOCKED</div>
              <h2 style={{ fontSize: '32px', color: '#fff', margin: '4px 0' }}>{unlockedAchievements.length} / 5</h2>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', overflow: 'hidden', marginTop: '10px' }}>
                <div style={{ width: `${(unlockedAchievements.length / 5) * 100}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '10px' }} />
              </div>
            </div>

            {/* List */}
            <div style={{ display: 'grid', gap: '16px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              {achievementsList.map(ach => {
                const isUnlocked = unlockedAchievements.includes(ach.id);
                return (
                  <div 
                    key={ach.id}
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      background: isUnlocked ? 'rgba(255, 107, 53, 0.04)' : 'rgba(255,255,255,0.01)',
                      border: `1px solid ${isUnlocked ? 'var(--primary-glow)' : 'var(--border-color)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      opacity: isUnlocked ? 1 : 0.45,
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: isUnlocked ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      boxShadow: isUnlocked ? '0 4px 10px var(--primary-glow)' : 'none',
                      flexShrink: 0
                    }}>
                      {isUnlocked ? ach.icon : <Lock size={20} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: 'bold' }}>{ach.title}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{ach.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SparkleIcon() {
  return (
    <Sparkles size={24} style={{ color: 'var(--primary)', filter: 'drop-shadow(0px 2px 4px var(--primary-glow))' }} />
  );
}
