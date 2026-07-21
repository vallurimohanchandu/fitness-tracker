import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import WeightChart from '../components/WeightChart';
import { Plus, Trash2, Calendar, Scale, ArrowDown, ArrowUp, Edit, HelpCircle } from 'lucide-react';

export default function WeightTracker({ showLogModal, onCloseLogModal }) {
  const {
    weightEntries,
    sortedWeightEntries,
    latestWeight,
    earliestWeight,
    totalWeightChange,
    loggedWeightToday,
    addWeightEntry,
    removeWeightEntry
  } = useApp();

  const [weightInput, setWeightInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  const handleLogWeight = (e) => {
    e.preventDefault();
    if (!weightInput || parseFloat(weightInput) <= 0) return;

    addWeightEntry(weightInput, noteInput.trim());
    setWeightInput('');
    setNoteInput('');
    setIsLogging(false);
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()) {
      return 'Today';
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (d.getFullYear() === yesterday.getFullYear() && d.getMonth() === yesterday.getMonth() && d.getDate() === yesterday.getDate()) {
      return 'Yesterday';
    }
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
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
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Weight Progress Tracker</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Monitor body mass changes and keep consistency.
          </p>
        </div>
        {!isLogging && (
          <button onClick={() => setIsLogging(true)}>
            <Plus size={16} /> Log Weight
          </button>
        )}
      </div>

      {/* Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div className="glass-card">
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Current Weight</span>
          <h2 style={{ fontSize: '28px', color: '#fff', marginTop: '6px' }}>
            {latestWeight ? `${latestWeight.weight.toFixed(1)}` : '--'} <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>kg</span>
          </h2>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Total Weight Change</span>
          <h2 style={{ 
            fontSize: '28px', 
            color: totalWeightChange === null ? '#fff' : totalWeightChange < 0 ? 'var(--success)' : 'var(--warning)', 
            marginTop: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {totalWeightChange === null ? (
              '--'
            ) : (
              <>
                {totalWeightChange < 0 ? <ArrowDown size={22} /> : <ArrowUp size={22} />}
                {Math.abs(totalWeightChange).toFixed(1)} kg
              </>
            )}
          </h2>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Starting Weight</span>
          <h2 style={{ fontSize: '28px', color: '#fff', marginTop: '6px' }}>
            {earliestWeight ? `${earliestWeight.weight.toFixed(1)}` : '--'} <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>kg</span>
          </h2>
          {earliestWeight && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Logged on {formatDate(earliestWeight.date)}
            </span>
          )}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '24px',
        alignItems: 'stretch'
      }}>
        {/* Trend Analysis Chart */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Weight History Trend</h3>
          <div style={{ flex: 1, minHeight: '220px' }}>
            <WeightChart entries={sortedWeightEntries} />
          </div>
        </div>

        {/* Logging Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Log History</h3>

          {/* Quick inline log input */}
          {isLogging && (
            <form onSubmit={handleLogWeight} className="animate-slide-up" style={{
              padding: '16px',
              background: 'var(--bg-darker)',
              border: '1px solid var(--primary-glow)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontWeight: 'bold' }}>Log Today's Weight</h4>
                <button type="button" className="secondary" style={{ padding: '4px 8px', fontSize: '10px' }} onClick={() => setIsLogging(false)}>Cancel</button>
              </div>

              <div>
                <label>Weight (kg)</label>
                <input
                  type="number"
                  placeholder="e.g. 75.5"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  step="0.1"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label>Progress Notes (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Fasted state, before breakfast"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
              </div>

              <button type="submit" style={{ marginTop: '4px' }}>
                Save Log Entry
              </button>
            </form>
          )}

          {/* Log List */}
          <div style={{
            display: 'grid',
            gap: '12px',
            maxHeight: '340px',
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            {weightEntries.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: '14px' }}>
                No weight logs recorded yet.
              </div>
            ) : (
              [...weightEntries].reverse().map(entry => (
                <div key={entry.id} style={{
                  padding: '14px 16px',
                  background: 'var(--bg-card-solid)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
                      {entry.weight.toFixed(1)} <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>kg</span>
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                      {formatDate(entry.date)}
                    </span>
                    {entry.note && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '4px', fontStyle: 'italic' }}>
                        "{entry.note}"
                      </span>
                    )}
                  </div>
                  <button 
                    className="secondary" 
                    style={{ padding: '6px', minWidth: 'auto', border: 'none', background: 'transparent' }}
                    onClick={() => removeWeightEntry(entry.id)}
                  >
                    <Trash2 size={16} style={{ color: 'var(--error)' }} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
