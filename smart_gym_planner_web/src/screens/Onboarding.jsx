import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Dumbbell, Trophy, Calendar, Sparkles, Target, Ruler } from 'lucide-react';

export default function Onboarding() {
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
    if (step > 1) setStep(step - 1);
  };

  const progressPercent = ((step - 1) / 5) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-card animate-scale-up" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '36px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Progress Bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '4px 4px 0 0',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'var(--primary-gradient)',
            transition: 'width var(--transition-normal)'
          }} />
        </div>

        {/* Step Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          color: 'var(--text-secondary)',
          fontSize: '13px',
          fontWeight: 600
        }}>
          <span>Step {step} of 6</span>
          <span style={{ color: 'var(--primary)' }}>{Math.round(progressPercent)}% Complete</span>
        </div>

        {/* STEP 1: Name & Password */}
        {step === 1 && (
          <div className="animate-fade-in" style={{ display: 'grid', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '26px', marginBottom: '12px' }}>Welcome! Create your account</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                Let's customize your fitness experience.
              </p>
            </div>
            <div>
              <label htmlFor="name-input">Username</label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Choose a username"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="password-input">Password</label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Experience Level */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '26px', marginBottom: '12px' }}>Your experience level?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
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
                    background: experienceLevel === opt.id ? 'var(--primary-glow)' : 'var(--bg-darker)',
                    border: `1px solid ${experienceLevel === opt.id ? 'var(--primary)' : 'var(--border-color)'}`,
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#fff', marginBottom: '4px' }}>{opt.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Days Per Week */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '26px', marginBottom: '12px' }}>How many days a week?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Pick your frequency so we can structure your splits.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[5, 6, 7].map(days => (
                <button
                  key={days}
                  onClick={() => setWorkoutDaysPerWeek(days)}
                  className="secondary"
                  style={{
                    flex: 1,
                    padding: '24px 0',
                    borderRadius: '16px',
                    flexDirection: 'column',
                    background: workoutDaysPerWeek === days ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.02)',
                    borderColor: workoutDaysPerWeek === days ? 'var(--primary)' : 'var(--border-color)',
                    boxShadow: workoutDaysPerWeek === days ? '0 6px 15px var(--primary-glow)' : 'none',
                    color: '#fff'
                  }}
                >
                  <Calendar size={22} style={{ marginBottom: '8px', color: workoutDaysPerWeek === days ? '#fff' : 'var(--primary)' }} />
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{days}</div>
                  <div style={{ fontSize: '11px', color: workoutDaysPerWeek === days ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' }}>days / week</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Goals */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '26px', marginBottom: '12px' }}>What is your goal?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
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
                    background: goal === opt.id ? 'var(--primary-glow)' : 'var(--bg-darker)',
                    border: `1px solid ${goal === opt.id ? 'var(--primary)' : 'var(--border-color)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#fff', marginBottom: '2px' }}>{opt.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{opt.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Equipment */}
        {step === 5 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '26px', marginBottom: '12px' }}>What equipment do you have?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Select all available tools. We will tailor exercises.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {equipmentOptions.map(opt => {
                const isSelected = equipment.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleEquipmentToggle(opt.id)}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: isSelected ? 'var(--primary-glow)' : 'var(--bg-darker)',
                      border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      textAlign: 'center',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{opt.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{opt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Body Stats */}
        {step === 6 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '26px', marginBottom: '12px' }}>Body Statistics</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Enter weight and height to initialize BMI and nutrition targets.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label htmlFor="height-feet">Feet</label>
                <select id="height-feet" value={heightFeet} onChange={(e) => setHeightFeet(e.target.value)}>
                  {[3, 4, 5, 6, 7, 8].map(ft => (
                    <option key={ft} value={ft}>{ft} ft</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="height-inches">Inches</label>
                <select id="height-inches" value={heightInches} onChange={(e) => setHeightInches(e.target.value)}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(inVal => (
                    <option key={inVal} value={inVal}>{inVal} in</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="weight-input">Weight (kg)</label>
                <input
                  id="weight-input"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 72"
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
          borderTop: '1px solid var(--border-color)'
        }}>
          {step > 1 ? (
            <button className="secondary" onClick={handleBack}>
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
              opacity: (
                (step === 1 && (!name.trim() || !password.trim())) ||
                (step === 6 && (!weight || parseFloat(weight) <= 0))
              ) ? 0.5 : 1,
              cursor: (
                (step === 1 && (!name.trim() || !password.trim())) ||
                (step === 6 && (!weight || parseFloat(weight) <= 0))
              ) ? 'not-allowed' : 'pointer'
            }}
          >
            {step === 6 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
