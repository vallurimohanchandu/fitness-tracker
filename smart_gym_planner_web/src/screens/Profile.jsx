import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Ruler, Scale, Eye, Dumbbell, Calendar, Target, LogOut, Edit2, Check } from 'lucide-react';

export default function Profile() {
  const {
    user,
    bmi,
    bmiCategory,
    saveUser,
    logOutUser: logout
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.fullName || user?.name || '');
  const [goal, setGoal] = useState(user?.primaryGoal || user?.goal || 'muscle_gain');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'beginner');
  const [workoutDays, setWorkoutDays] = useState(user?.workoutDays || user?.workoutDaysPerWeek || 5);
  const getFeetAndInches = (cm) => {
    if (!cm) return { feet: 5, inches: 7 };
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches: inches === 12 ? 11 : inches };
  };

  const formatHeight = (cm) => {
    if (!cm) return '--';
    const { feet, inches } = getFeetAndInches(cm);
    return `${feet} ft ${inches} in`;
  };

  const initialHeight = getFeetAndInches(user?.height);
  const [heightFeet, setHeightFeet] = useState(initialHeight.feet.toString());
  const [heightInches, setHeightInches] = useState(initialHeight.inches.toString());
  const [weight, setWeight] = useState(user?.weight || '');
  const [equipment, setEquipment] = useState(user?.equipment || []);

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

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !weight) return;

    const heightCm = (parseFloat(heightFeet) * 12 + parseFloat(heightInches)) * 2.54;

    saveUser({
      name: name.trim(),
      goal,
      experienceLevel,
      workoutDaysPerWeek: parseInt(workoutDays),
      height: heightCm,
      weight: parseFloat(weight),
      equipment: equipment.length === 0 ? ['none'] : equipment
    });
    setIsEditing(false);
  };

  // BMI pointer calculation (between 15 and 35)
  const getBmiPointerPercent = () => {
    if (!bmi) return 0;
    const clamped = Math.max(15, Math.min(35, bmi));
    return ((clamped - 15) / 20) * 100;
  };

  const getBmiColor = () => {
    if (bmiCategory === 'Underweight') return '#60a5fa'; // Blue
    if (bmiCategory === 'Normal') return 'var(--accent)'; // Green
    if (bmiCategory === 'Overweight') return 'var(--warning)'; // Orange
    return 'var(--error)'; // Red
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '30px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Your Profile</h1>
        <button 
          className="secondary" 
          style={{ gap: '6px', padding: '10px 18px', fontSize: '13px', borderRadius: '10px', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
          onClick={logout}
        >
          <LogOut size={14} /> Reset App (Logout)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
        {/* Profile Card & Editing Form */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Profile Details</h3>
            {!isEditing && (
              <button 
                className="secondary" 
                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', gap: '4px' }}
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={12} /> Edit Profile
              </button>
            )}
          </div>

          {!isEditing ? (
            /* View Mode */
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'var(--primary-glow)',
                  border: '1px solid var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <User size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '20px' }}>{user?.name}</h2>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Registered Athlete</span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginTop: '10px'
              }}>
                <StatItem icon={<Ruler size={16} />} label="Height" val={formatHeight(user?.height)} />
                <StatItem icon={<Scale size={16} />} label="Weight" val={`${user?.weight} kg`} />
                <StatItem icon={<Target size={16} />} label="Goal" val={user?.goal?.replace('_', ' ')} />
                <StatItem icon={<Eye size={16} />} label="Level" val={user?.experienceLevel} />
                <StatItem icon={<Calendar size={16} />} label="Frequency" val={`${user?.workoutDaysPerWeek} Days/Week`} />
              </div>

              {/* Equipment Logged */}
              <div style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Configured Equipment</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {user?.equipment?.map(eq => {
                    const option = equipmentOptions.find(o => o.id === eq);
                    return (
                      <span 
                        key={eq}
                        style={{
                          fontSize: '12px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          color: '#fff'
                        }}
                      >
                        {option ? `${option.icon} ${option.label}` : eq}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode Form */
            <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px' }}>
                <div>
                  <label htmlFor="edit-height-feet">Feet</label>
                  <select id="edit-height-feet" value={heightFeet} onChange={(e) => setHeightFeet(e.target.value)}>
                    {[3, 4, 5, 6, 7, 8].map(ft => (
                      <option key={ft} value={ft}>{ft} ft</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-height-inches">Inches</label>
                  <select id="edit-height-inches" value={heightInches} onChange={(e) => setHeightInches(e.target.value)}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(inVal => (
                      <option key={inVal} value={inVal}>{inVal} in</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Weight (kg)</label>
                  <input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label>Fitness Goal</label>
                  <select value={goal} onChange={(e) => setGoal(e.target.value)}>
                    <option value="fat_loss">Fat Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="maintain">Maintain</option>
                  </select>
                </div>
                <div>
                  <label>Experience Level</label>
                  <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Frequency (Days/Week)</label>
                <select value={workoutDays} onChange={(e) => setWorkoutDays(parseInt(e.target.value))}>
                  <option value={5}>5 Days</option>
                  <option value={6}>6 Days</option>
                  <option value={7}>7 Days</option>
                </select>
              </div>

              {/* Equipment config */}
              <div>
                <label>Equipment Available</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
                  {equipmentOptions.map(opt => {
                    const isSelected = equipment.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleEquipmentToggle(opt.id)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          background: isSelected ? 'var(--primary-glow)' : 'var(--bg-darker)',
                          border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '12px',
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        {isSelected ? <Check size={14} style={{ color: 'var(--primary)' }} /> : <span>{opt.icon}</span>}
                        <span style={{ color: '#fff', fontWeight: 500 }}>{opt.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="secondary" style={{ flex: 1 }} onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1 }}>
                  Save Profile
                </button>
              </div>
            </form>
          )}
        </div>

        {/* BMI analysis card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>BMI Analysis</h3>
          
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your BMI score</span>
            <h1 style={{ fontSize: '56px', fontWeight: '800', color: getBmiColor(), lineHeight: 1.1, margin: '6px 0' }}>
              {bmi || '--'}
            </h1>
            <div style={{
              display: 'inline-block',
              background: `${getBmiColor()}15`,
              border: `1px solid ${getBmiColor()}`,
              color: getBmiColor(),
              padding: '6px 16px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '14px',
              marginTop: '4px'
            }}>
              {bmiCategory}
            </div>
          </div>

          {/* BMI visual scale */}
          <div style={{ position: 'relative', marginTop: '16px' }}>
            {/* The Pointer */}
            <div style={{
              position: 'absolute',
              top: '-18px',
              left: `${getBmiPointerPercent()}%`,
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'left 0.5s ease'
            }}>
              <div style={{
                background: getBmiColor(),
                color: '#fff',
                fontSize: '10px',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
              }}>
                You
              </div>
              <div style={{
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: `6px solid ${getBmiColor()}`
              }} />
            </div>

            {/* Scale Bar */}
            <div style={{
              height: '10px',
              width: '100%',
              borderRadius: '10px',
              background: 'linear-gradient(to right, #60a5fa 0%, #00d4aa 30%, #f59e0b 65%, #ef4444 100%)',
              display: 'flex',
              overflow: 'hidden'
            }} />

            {/* Labels under scale */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: 'var(--text-muted)',
              marginTop: '8px'
            }}>
              <span>18.5 (Under)</span>
              <span>25.0 (Normal)</span>
              <span>30.0 (Over)</span>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', marginTop: '10px' }}>
            *Body Mass Index (BMI) is a starting point for assessing body composition, but does not distinguish muscle mass from body fat. Keep this in mind if your goal is muscle hypertrophy.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, label, val }) {
  return (
    <div style={{
      padding: '12px',
      background: 'var(--bg-darker)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div style={{ color: 'var(--primary)' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginTop: '2px' }}>{val}</div>
      </div>
    </div>
  );
}
