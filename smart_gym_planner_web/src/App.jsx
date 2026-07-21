import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Onboarding from './screens/Onboarding';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import WorkoutPlan from './screens/WorkoutPlan';
import CalorieTracker from './screens/CalorieTracker';
import WeightTracker from './screens/WeightTracker';
import Profile from './screens/Profile';
import { Dumbbell, LayoutDashboard, Calendar, Utensils, Scale, UserCheck } from 'lucide-react';

export default function App() {
  const { onboardingDone, isLoggedIn, setIsLoggedIn, achievementToast } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!onboardingDone) {
    return <Onboarding />;
  }

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Premium Glass Header Navigation */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(9, 9, 14, 0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'var(--primary-gradient)',
            padding: '8px',
            borderRadius: '10px',
            color: '#fff',
            boxShadow: '0 4px 10px var(--primary-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Dumbbell size={20} />
          </div>
          <span style={{
            fontFamily: 'var(--font-title)',
            fontWeight: 800,
            fontSize: '18px',
            letterSpacing: '0.05em',
            background: 'linear-gradient(to right, #ffffff, var(--text-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            SMART GYM
          </span>
        </div>

        {/* Tab Items */}
        <nav style={{ display: 'flex', gap: '8px', height: '100%', alignItems: 'center' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
            { id: 'workout', label: 'Workouts', icon: <Calendar size={16} /> },
            { id: 'calorie', label: 'Calories', icon: <Utensils size={16} /> },
            { id: 'progress', label: 'Weight', icon: <Scale size={16} /> },
            { id: 'profile', label: 'Profile', icon: <UserCheck size={16} /> }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="secondary"
                style={{
                  background: isActive ? 'rgba(255, 107, 53, 0.08)' : 'transparent',
                  borderColor: isActive ? 'rgba(255, 107, 53, 0.25)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  gap: '6px',
                  transition: 'var(--transition-fast)',
                  boxShadow: 'none'
                }}
              >
                {tab.icon}
                <span className="nav-label">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Responsive Content */}
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 24px'
      }}>
        {activeTab === 'dashboard' && (
          <Dashboard 
            setActiveTab={setActiveTab} 
            onOpenWeightModal={() => setActiveTab('progress')}
            onOpenCalorieModal={() => setActiveTab('calorie')}
          />
        )}
        {activeTab === 'workout' && <WorkoutPlan />}
        {activeTab === 'calorie' && <CalorieTracker />}
        {activeTab === 'progress' && <WeightTracker />}
        {activeTab === 'profile' && <Profile />}
      </main>

      {/* Mobile-friendly style adjustments in inline tag */}
      <style>{`
        @media (max-width: 680px) {
          .nav-label {
            display: none;
          }
          header {
            padding: 0 16px !important;
          }
          main {
            padding: 20px 16px !important;
          }
        }
      `}</style>
      {/* Achievement Unlock Toast Notification */}
      {achievementToast?.show && (
        <div className="animate-slide-up" style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(9, 9, 14, 0.95)',
          border: '1px solid var(--primary)',
          boxShadow: '0 10px 30px var(--primary-glow)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          zIndex: 10000,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            boxShadow: '0 4px 10px var(--primary-glow)',
            flexShrink: 0
          }}>
            {achievementToast.icon}
          </div>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Achievement Unlocked!</span>
            <h4 style={{ fontSize: '14px', color: '#fff', fontWeight: 'bold', marginTop: '2px' }}>{achievementToast.title}</h4>
          </div>
        </div>
      )}
    </div>
  );
}
