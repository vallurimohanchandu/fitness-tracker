import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Dumbbell, Award, Flame, Zap, Compass, RefreshCw, ChevronDown, ChevronUp, Mic, MicOff, CheckCircle } from 'lucide-react';

export default function WorkoutPlan() {
  const {
    workoutPlan,
    markDayCompleted,
    resetWorkoutPlan
  } = useApp();

  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [activeSection, setActiveSection] = useState('main'); // warmup | main | stretch

  if (!workoutPlan) {
    return (
      <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>
        No workout plan generated. Please complete onboarding.
      </div>
    );
  }

  const activeDay = workoutPlan.days[activeDayIdx];

  const handleToggleComplete = (idx) => {
    markDayCompleted(idx);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '30px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Your Weekly Plan</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Tailored for experience level: <strong style={{ color: 'var(--primary)' }}>{workoutPlan.generatedFor}</strong>
          </p>
        </div>
        <button 
          className="secondary" 
          style={{ gap: '6px', padding: '10px 18px', fontSize: '13px', borderRadius: '10px' }}
          onClick={resetWorkoutPlan}
        >
          <RefreshCw size={14} /> Reset Weekly Plan
        </button>
      </div>

      {/* Week Days Navigation Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${workoutPlan.days.length}, 1fr)`,
        gap: '10px',
        marginBottom: '28px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }}>
        {workoutPlan.days.map((day, idx) => {
          const isActive = activeDayIdx === idx;
          return (
            <div
              key={day.dayName}
              onClick={() => setActiveDayIdx(idx)}
              style={{
                background: isActive ? 'var(--primary-gradient)' : 'var(--bg-card)',
                border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: '14px',
                padding: '14px 10px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'var(--transition-fast)',
                position: 'relative',
                boxShadow: isActive ? '0 4px 12px var(--primary-glow)' : 'none',
                minWidth: '70px'
              }}
            >
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)',
                textTransform: 'uppercase'
              }}>
                {day.dayName}
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: 'bold',
                color: isActive ? '#fff' : 'var(--text-primary)',
                marginTop: '4px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {day.splitName.split(' ')[0]}
              </div>
              {day.isCompleted && (
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '16px',
                  height: '16px',
                  background: 'var(--success)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  color: '#fff',
                  border: '2px solid var(--bg-dark)'
                }}>
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Focus Split Detail */}
      {activeDay && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
          {/* Workout Section */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {activeDay.dayName} FOCUS
                </span>
                <h2 style={{ fontSize: '24px', marginTop: '2px' }}>{activeDay.splitName}</h2>
              </div>
              
              {activeDay.isCompleted ? (
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
                  <Award size={16} /> Completed
                </div>
              ) : (
                <button onClick={() => handleToggleComplete(activeDayIdx)}>
                  Mark Day Completed
                </button>
              )}
            </div>

            {/* Sub-sections tabs (Warmup, Main lifts, Stretching) */}
            <div style={{
              display: 'flex',
              gap: '10px',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '10px'
            }}>
              {[
                { id: 'warmup', label: 'Warm-up' },
                { id: 'main', label: 'Main Workout' },
                { id: 'stretch', label: 'Cool Down / Stretching' }
              ].map(sec => (
                <div
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: activeSection === sec.id ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {sec.label}
                  {activeSection === sec.id && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-11px',
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'var(--primary)'
                    }} />
                  )}
                </div>
              ))}
            </div>

            {/* List of exercises */}
            <div style={{ display: 'grid', gap: '16px' }}>
              {activeSection === 'warmup' && activeDay.warmup.map(ex => (
                <ExerciseListItem key={ex.id} exercise={ex} dayIdx={activeDayIdx} />
              ))}
              {activeSection === 'main' && activeDay.exercises.map(ex => (
                <ExerciseListItem key={ex.id} exercise={ex} dayIdx={activeDayIdx} />
              ))}
              {activeSection === 'stretch' && activeDay.stretching.map(ex => (
                <ExerciseListItem key={ex.id} exercise={ex} dayIdx={activeDayIdx} />
              ))}
            </div>
          </div>

          {/* Sidebar Stats and Cardio */}
          <div style={{ display: 'grid', gap: '24px' }}>
            {/* Split Metrics Box */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Split Metrics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{
                  padding: '16px',
                  background: 'var(--bg-darker)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <Flame size={20} style={{ color: 'var(--primary)', marginBottom: '6px' }} />
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{activeDay.estimatedCalories}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '2px' }}>Est. Burn (kcal)</div>
                </div>
                <div style={{
                  padding: '16px',
                  background: 'var(--bg-darker)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <Dumbbell size={20} style={{ color: 'var(--accent)', marginBottom: '6px' }} />
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{activeDay.exercises.length}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '2px' }}>Exercises</div>
                </div>
              </div>
            </div>

            {/* Cardio Section */}
            {activeDay.cardio && activeDay.cardio.length > 0 && (
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={18} style={{ color: 'var(--primary)' }} /> Daily Cardio Session
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {activeDay.cardio.map(cardioEx => (
                    <div key={cardioEx.id} style={{
                      padding: '14px',
                      background: 'var(--bg-darker)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
                        <span>{cardioEx.name}</span>
                        <span style={{ color: 'var(--accent)' }}>{cardioEx.reps}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                        {cardioEx.instructions}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ExerciseListItem({ exercise, dayIdx }) {
  const { loggedSets, updateSetLog } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState('');

  const key = `${dayIdx}_${exercise.id}`;
  const setsCount = parseInt(exercise.sets) || 3;
  const setsData = loggedSets[key] || Array(setsCount).fill({ weight: '', reps: '', isCompleted: false });

  // Web Speech recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSpeechSupported = !!SpeechRecognition;

  const handleStartVoiceLog = (e) => {
    e.stopPropagation(); // Avoid collapsing panel
    if (!isSpeechSupported) {
      alert('Speech recognition is not supported in this browser. Try Chrome/Edge.');
      return;
    }

    if (isListening) return;

    setIsListening(true);
    setVoiceFeedback('Listening... Speak: "Set 1, 80 kilos, 10 reps"');

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setVoiceFeedback(`Heard: "${speechResult}"`);
      parseAndApplyVoiceLog(speechResult);
    };

    rec.onerror = (err) => {
      console.error(err);
      setVoiceFeedback('Could not hear you. Please try again.');
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.start();
  };

  const parseAndApplyVoiceLog = (speechText) => {
    const clean = speechText.toLowerCase().replace(/,/g, '');
    
    // Find set number
    let setNum = null;
    const setMatch = clean.match(/set\s+(\d+|one|two|three|four|five)/);
    if (setMatch) {
      const rawVal = setMatch[1];
      const wordMap = { one: 1, two: 2, three: 3, four: 4, five: 5 };
      setNum = parseInt(rawVal) || wordMap[rawVal] || null;
    }

    // Weight
    let weight = null;
    const weightMatch = clean.match(/(\d+(\.\d+)?)\s*(kg|kilo|kilos|lbs|pound|pounds)/);
    if (weightMatch) {
      weight = parseFloat(weightMatch[1]);
    }

    // Reps
    let reps = null;
    const repsMatch = clean.match(/(\d+)\s*(rep|reps|time|times)/);
    if (repsMatch) {
      reps = parseInt(repsMatch[1]);
    }

    // Done completion
    const isDone = clean.includes('done') || clean.includes('complete') || clean.includes('check') || clean.includes('finish');

    // Fallback: positional speech matching like "set 1 80 10"
    if (setNum && !weight && !reps) {
      const numbers = clean.match(/\d+/g);
      if (numbers && numbers.length >= 3) {
        const spokenSet = parseInt(numbers[0]);
        const spokenWeight = parseFloat(numbers[1]);
        const spokenReps = parseInt(numbers[2]);

        if (spokenSet > 0 && spokenSet <= setsCount) {
          updateSetLog(dayIdx, exercise.id, spokenSet - 1, 'weight', spokenWeight);
          updateSetLog(dayIdx, exercise.id, spokenSet - 1, 'reps', spokenReps);
          updateSetLog(dayIdx, exercise.id, spokenSet - 1, 'isCompleted', true);
          setVoiceFeedback(`Logged Set ${spokenSet}: ${spokenWeight}kg x ${spokenReps} reps!`);
          return;
        }
      }
    }

    if (setNum) {
      if (setNum > 0 && setNum <= setsCount) {
        const idx = setNum - 1;
        if (weight !== null) updateSetLog(dayIdx, exercise.id, idx, 'weight', weight);
        if (reps !== null) updateSetLog(dayIdx, exercise.id, idx, 'reps', reps);
        if (isDone || (weight !== null && reps !== null)) {
          updateSetLog(dayIdx, exercise.id, idx, 'isCompleted', true);
        }
        setVoiceFeedback(`Set ${setNum} updated successfully!`);
      } else {
        setVoiceFeedback(`Sorry, this exercise only has ${setsCount} sets.`);
      }
    } else {
      setVoiceFeedback('Failed to recognize set number. Try: "Set 1 done".');
    }
  };

  return (
    <div style={{
      background: 'var(--bg-card-solid)',
      border: '1px solid var(--border-color)',
      borderRadius: '14px',
      overflow: 'hidden',
      transition: 'var(--transition-fast)'
    }}>
      <div 
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Rounded Image with fallback */}
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            overflow: 'hidden',
            background: 'var(--bg-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <img 
              src={exercise.imageUrl} 
              alt={exercise.name}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{exercise.name}</h4>
            <span style={{
              fontSize: '10px',
              fontWeight: 'bold',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {exercise.muscleGroup}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)' }}>
              {exercise.sets} sets
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {exercise.reps} reps
            </div>
          </div>
          {expanded ? <ChevronUp size={18} style={{ color: 'var(--text-secondary)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-secondary)' }} />}
        </div>
      </div>

      {expanded && (
        <div className="animate-slide-up" style={{
          padding: '20px 16px',
          background: 'rgba(0,0,0,0.15)',
          borderTop: '1px solid var(--border-color)',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: '1.5',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Instructions */}
          <div>
            <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>Instructions:</div>
            <p>{exercise.instructions}</p>
          </div>

          {/* Interactive Set Tracker with voice controls */}
          <div style={{
            background: 'var(--bg-dark)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>Log Workout Sets</span>
              
              {/* Mic Icon Button */}
              {isSpeechSupported && (
                <button
                  onClick={handleStartVoiceLog}
                  className="secondary"
                  style={{
                    padding: '6px 12px',
                    fontSize: '11px',
                    borderRadius: '8px',
                    gap: '6px',
                    color: isListening ? 'var(--primary)' : 'var(--text-secondary)',
                    borderColor: isListening ? 'var(--primary)' : 'var(--border-color)',
                    background: isListening ? 'rgba(255, 107, 53, 0.08)' : 'transparent',
                    boxShadow: 'none'
                  }}
                >
                  {isListening ? (
                    <>
                      <MicOff size={12} className="animate-pulse" /> Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic size={12} /> Log by Voice
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Voice feedback message */}
            {voiceFeedback && (
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px dashed var(--border-color)',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontStyle: 'italic',
                color: isListening ? 'var(--primary)' : 'var(--text-secondary)',
                marginBottom: '14px'
              }}>
                {voiceFeedback}
              </div>
            )}

            {/* Sets log grid */}
            <div style={{ display: 'grid', gap: '10px' }}>
              {Array.from({ length: setsCount }).map((_, idx) => {
                const currentSet = setsData[idx] || { weight: '', reps: '', isCompleted: false };
                return (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    background: currentSet.isCompleted ? 'rgba(0, 212, 170, 0.03)' : 'rgba(255,255,255,0.01)',
                    border: `1px solid ${currentSet.isCompleted ? 'rgba(0, 212, 170, 0.2)' : 'var(--border-color)'}`,
                    padding: '8px 12px',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontWeight: 'bold', color: currentSet.isCompleted ? 'var(--accent)' : 'var(--text-secondary)' }}>
                      Set {idx + 1}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="number"
                        placeholder="kg"
                        value={currentSet.weight || ''}
                        onChange={(e) => updateSetLog(dayIdx, exercise.id, idx, 'weight', e.target.value)}
                        style={{ width: '65px', padding: '6px', textAlign: 'center', margin: 0 }}
                      />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>kg</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="number"
                        placeholder="reps"
                        value={currentSet.reps || ''}
                        onChange={(e) => updateSetLog(dayIdx, exercise.id, idx, 'reps', e.target.value)}
                        style={{ width: '65px', padding: '6px', textAlign: 'center', margin: 0 }}
                      />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>reps</span>
                    </div>

                    {/* Completion Checkmark */}
                    <button
                      onClick={() => updateSetLog(dayIdx, exercise.id, idx, 'isCompleted', !currentSet.isCompleted)}
                      className="secondary"
                      style={{
                        padding: '6px',
                        minWidth: 'auto',
                        border: 'none',
                        background: 'transparent',
                        boxShadow: 'none',
                        color: currentSet.isCompleted ? 'var(--accent)' : 'var(--text-muted)'
                      }}
                    >
                      <CheckCircle size={18} fill={currentSet.isCompleted ? 'rgba(0, 212, 170, 0.15)' : 'none'} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          
          {exercise.requiredEquipment && exercise.requiredEquipment.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
              {exercise.requiredEquipment.map(eq => (
                <span key={eq} style={{
                  fontSize: '9px',
                  fontWeight: 'bold',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  {eq}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
