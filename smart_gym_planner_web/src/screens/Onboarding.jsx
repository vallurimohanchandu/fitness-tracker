import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Dumbbell, Trophy, Calendar, Sparkles, Target, Ruler } from 'lucide-react';

export default function Onboarding({ onCancel }) {
  const { saveUser } = useApp();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [workoutDaysPerWeek, setWorkoutDaysPerWeek] = useState(5);
  const [goal, setGoal] = useState('muscle_gain');
  const [equipment, setEquipment] = useState([]);
  const [heightFeet, setHeightFeet] = useState('5');
  const [heightInches, setHeightInches] = useState('7');
  const [weight, setWeight] = useState('');

  const equipmentOptions = [
    { id: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
    { id: 'barbell', label: 'Barbell', icon: '🏋️‍♂️' },
    { id: 'resistance_bands', label: 'Resistance Bands', icon: '🎗️' },
    { id: 'machines', label: 'Gym Machines', icon: '🦾' },
    { id: 'none', label: 'No Equipment (Bodyweight)', icon: '🧘' }
  ];

  const handleEquipmentToggle = (id) => {
    if (id === 'none') {
      setEquipment(['none']);
      return;
    }
    const filtered = equipment.filter(e => e !== 'none');
    if (filtered.includes(id)) {
      setEquipment(filtered.filter(e => e !== id));
    } else {
      setEquipment([...filtered, id]);
    }
  };

  const handleNext = () => {
    if (step === 1 && (!name.trim() || !password.trim())) return;
    if (step === 6) {
      if (!weight || parseFloat(weight) <= 0) return;
      const heightCm = (parseFloat(heightFeet) * 12 + parseFloat(heightInches)) * 2.54;
      saveUser({
        name: name.trim(),
        password: password.trim(),
        experienceLevel,
        workoutDaysPerWeek: parseInt(workoutDaysPerWeek),
        goal,
        equipment: equipment.length === 0 ? ['none'] : equipment,
        height: heightCm,
        weight: parseFloat(weight)
      });
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const progressPercent = ((step - 1) / 5) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#f0f4f8', // Matching the login screen light background
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Clean White Card matching the sign-in layout */}
      <div className="animate-scale-up" style={{
        width: '100%',
        maxWidth: '540px',
        padding: '40px 32px',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0, 0, 0, 0.02)',
        color: '#1a1a1a',
        boxSizing: 'border-box'
      }}>
        {/* Step Indicator Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          color: '#666',
          fontSize: '13px',
          fontWeight: 600
        }}>
          <span>Step {step} of 6</span>
          <span style={{ color: '#2563eb' }}>{Math.round(progressPercent)}% Complete</span>
        </div>

        {/* STEP 1: Name & Password */}
        {step === 1 && (
          <div className="animate-fade-in" style={{ display: 'grid', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#1a1a1a' }}>Create your account</h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                Let's customize your fitness experience.
              </p>
            </div>
            <div>
              <label htmlFor="name-input" style={{ fontSize: '13px', fontWeight: 500, color: '#4d4d4d', display: 'block', marginBottom: '6px' }}>Username</label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Choose a username"
                style={{
                  height: '44px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  padding: '0 16px',
                  fontSize: '15px',
                  color: '#1e293b',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="password-input" style={{ fontSize: '13px', fontWeight: 500, color: '#4d4d4d', display: 'block', marginBottom: '6px' }}>Password</label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
                style={{
                  height: '44px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  padding: '0 16px',
                  fontSize: '15px',
                  color: '#1e293b',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        )}

        {/* STEP 2: Experience Level */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#1a1a1a' }}>Your experience level?</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              We'll filter exercises based on your physical familiarity.
            </p>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { id: 'beginner', title: 'Beginner', desc: 'New to gym training / learning forms' },
                { id: 'intermediate', title: 'Intermediate', desc: 'Consistently training for 6+ months' },
                { id: 'expert', title: 'Expert / Advanced', desc: 'Multiple years of structured lifting experience' }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setExperienceLevel(opt.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: experienceLevel === opt.id ? '#eff6ff' : '#f8fafc',
                    border: `2px solid ${experienceLevel === opt.id ? '#2563eb' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '15px', color: experienceLevel === opt.id ? '#1e3a8a' : '#1a1a1a', marginBottom: '4px' }}>{opt.title}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Days Per Week */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#1a1a1a' }}>How many days a week?</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Pick your frequency so we can structure your splits.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[5, 6, 7].map(days => (
                <button
                  key={days}
                  onClick={() => setWorkoutDaysPerWeek(days)}
                  style={{
                    flex: 1,
                    padding: '24px 0',
                    borderRadius: '12px',
                    flexDirection: 'column',
                    background: workoutDaysPerWeek === days ? '#eff6ff' : '#f8fafc',
                    border: `2px solid ${workoutDaysPerWeek === days ? '#2563eb' : '#e2e8f0'}`,
                    color: workoutDaysPerWeek === days ? '#1e3a8a' : '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: 'none'
                  }}
                >
                  <Calendar size={22} style={{ marginBottom: '8px', color: workoutDaysPerWeek === days ? '#2563eb' : '#666' }} />
                  <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{days}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>days / week</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Goals */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#1a1a1a' }}>What is your goal?</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Used to calculate target calories and workout intensities.
            </p>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { id: 'fat_loss', title: 'Fat Loss & Shred', desc: 'Caloric deficit diet focus with fat-burning splits', icon: '🔥' },
                { id: 'muscle_gain', title: 'Muscle Growth / Bulk', desc: 'Slight surplus calorie targets for lean muscle hypertrophy', icon: '💪' },
                { id: 'maintain', title: 'Maintenance & Tone', desc: 'Balance energy inputs to sustain body weight & improve health', icon: '⚖️' }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setGoal(opt.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: goal === opt.id ? '#eff6ff' : '#f8fafc',
                    border: `2px solid ${goal === opt.id ? '#2563eb' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: goal === opt.id ? '#1e3a8a' : '#1a1a1a', marginBottom: '2px' }}>{opt.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{opt.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Equipment */}
        {step === 5 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#1a1a1a' }}>What equipment do you have?</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Select all that apply. We'll build routines accordingly.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {equipmentOptions.map(opt => {
                const isSelected = equipment.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleEquipmentToggle(opt.id)}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: isSelected ? '#eff6ff' : '#f8fafc',
                      border: `2px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{opt.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: isSelected ? '#1e3a8a' : '#1a1a1a' }}>{opt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Body Stats */}
        {step === 6 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#1a1a1a' }}>Body Statistics</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Enter weight and height to initialize BMI and nutrition targets.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label htmlFor="height-feet" style={{ fontSize: '13px', fontWeight: 500, color: '#4d4d4d', display: 'block', marginBottom: '6px' }}>Feet</label>
                <select 
                  id="height-feet" 
                  value={heightFeet} 
                  onChange={(e) => setHeightFeet(e.target.value)}
                  style={{
                    height: '44px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    padding: '0 10px',
                    fontSize: '15px',
                    color: '#1e293b',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  {[3, 4, 5, 6, 7, 8].map(ft => (
                    <option key={ft} value={ft}>{ft} ft</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="height-inches" style={{ fontSize: '13px', fontWeight: 500, color: '#4d4d4d', display: 'block', marginBottom: '6px' }}>Inches</label>
                <select 
                  id="height-inches" 
                  value={heightInches} 
                  onChange={(e) => setHeightInches(e.target.value)}
                  style={{
                    height: '44px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    padding: '0 10px',
                    fontSize: '15px',
                    color: '#1e293b',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(inVal => (
                    <option key={inVal} value={inVal}>{inVal} in</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="weight-input" style={{ fontSize: '13px', fontWeight: 500, color: '#4d4d4d', display: 'block', marginBottom: '6px' }}>Weight (kg)</label>
                <input
                  id="weight-input"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 72"
                  style={{
                    height: '44px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    padding: '0 16px',
                    fontSize: '15px',
                    color: '#1e293b',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '36px',
          paddingTop: '24px',
          borderTop: '1px solid #e2e8f0'
        }}>
          {(step > 1 || onCancel) ? (
            <button 
              onClick={handleBack}
              style={{
                height: '40px',
                padding: '0 20px',
                borderRadius: '8px',
                background: '#f1f5f9',
                color: '#475569',
                border: 'none',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: 'none'
              }}
            >
              Back
            </button>
          ) : (
            <div />
          )}
          
          <button 
            onClick={handleNext}
            disabled={
              (step === 1 && (!name.trim() || !password.trim())) ||
              (step === 6 && (!weight || parseFloat(weight) <= 0))
            }
            style={{
              height: '40px',
              padding: '0 20px',
              borderRadius: '8px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: 'none',
              opacity: (
                (step === 1 && (!name.trim() || !password.trim())) ||
                (step === 6 && (!weight || parseFloat(weight) <= 0))
              ) ? 0.5 : 1
            }}
          >
            {step === 6 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
