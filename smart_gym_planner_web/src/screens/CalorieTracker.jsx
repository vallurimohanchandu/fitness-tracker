import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { foodItems, getCaloriesForServings, getMacrosForServings } from '../data/foodData';
import { Search, Plus, Trash2, Calendar, Target, Scale, Sparkles, Check } from 'lucide-react';

export default function CalorieTracker() {
  const {
    foodEntries,
    caloriesConsumedToday,
    macrosConsumedToday,
    nutritionTarget,
    addFoodEntry,
    removeFoodEntry
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [qty, setQty] = useState(1);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Custom food state
  const [customName, setCustomName] = useState('');
  const [customCals, setCustomCals] = useState('');
  const [customProt, setCustomProt] = useState('');
  const [customCarb, setCustomCarb] = useState('');
  const [customFat, setCustomFat] = useState('');

  const searchResults = searchQuery.trim()
    ? foodItems.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setQty(1);
    setIsCustomMode(false);
  };

  const handleAddPredefined = () => {
    if (!selectedFood) return;
    const cals = getCaloriesForServings(selectedFood, qty);
    const macs = getMacrosForServings(selectedFood, qty);
    addFoodEntry(`${selectedFood.emoji} ${selectedFood.name} (x${qty})`, cals, macs);
    setSelectedFood(null);
    setSearchQuery('');
  };

  const handleAddQuickRecommend = (item) => {
    const cals = getCaloriesForServings(item, 1);
    const macs = getMacrosForServings(item, 1);
    addFoodEntry(`${item.emoji} ${item.name} (x1)`, cals, macs);
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customName.trim() || !customCals) return;

    addFoodEntry(
      `🍳 ${customName.trim()}`,
      parseInt(customCals),
      {
        protein: parseFloat(customProt || 0),
        carbs: parseFloat(customCarb || 0),
        fat: parseFloat(customFat || 0),
        fiber: 0
      }
    );

    // Reset custom inputs
    setCustomName('');
    setCustomCals('');
    setCustomProt('');
    setCustomCarb('');
    setCustomFat('');
    setIsCustomMode(false);
  };

  const getFilteredTodayEntries = () => {
    const now = new Date();
    return foodEntries.filter(e => {
      const d = new Date(e.timestamp);
      return d.getFullYear() === now.getFullYear() &&
             d.getMonth() === now.getMonth() &&
             d.getDate() === now.getDate();
    }).reverse();
  };

  const todayEntries = getFilteredTodayEntries();

  // Helper macro circular percentage calculation
  const getPercent = (val, max) => Math.min(100, (val / max) * 100);

  // Heuristic Smart Meal Recommendations (Remaining Macro Matcher)
  const getSmartRecommendations = () => {
    const gapCals = nutritionTarget.calories - caloriesConsumedToday;
    const gapProt = nutritionTarget.protein - macrosConsumedToday.protein;

    if (gapCals <= 150) return []; // Too close to target to suggest anything substantial

    return foodItems
      .map(item => {
        const itemCals = getCaloriesForServings(item, 1);
        const itemMacros = getMacrosForServings(item, 1);

        // Filter out if it exceeds remaining calorie budget
        if (itemCals > gapCals) return null;

        let score = 0;
        
        // Prioritize high protein if user is behind on protein target
        if (gapProt > 0 && itemMacros.protein > 0) {
          // Protein density ratio (protein per calorie)
          score += (itemMacros.protein / itemCals) * 250;
          
          // Boost if single serving fits a large portion of remaining protein gap
          if (itemMacros.protein >= gapProt * 0.4 && itemMacros.protein <= gapProt * 1.1) {
            score += 45;
          }
        } else {
          // If protein is done, score based on simple caloric fit
          score += (1 - Math.abs(itemCals - (gapCals * 0.5)) / (gapCals * 0.5)) * 20;
        }

        return { item, score, cals: itemCals, macros: itemMacros };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(match => match.item);
  };

  const recommendations = getSmartRecommendations();

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '30px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>Calorie & Nutrition Tracker</h1>

      {/* Targets and Circular Macro Rings */}
      <div className="glass-card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px', textAlign: 'center' }}>
          {/* Calorie Ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MacroRing 
              percent={getPercent(caloriesConsumedToday, nutritionTarget.calories)} 
              value={caloriesConsumedToday} 
              target={nutritionTarget.calories} 
              unit="kcal" 
              color="var(--primary)"
            />
            <span style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '10px' }}>Calories</span>
          </div>

          {/* Protein Ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MacroRing 
              percent={getPercent(macrosConsumedToday.protein, nutritionTarget.protein)} 
              value={macrosConsumedToday.protein} 
              target={nutritionTarget.protein} 
              unit="g" 
              color="var(--accent)"
            />
            <span style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '10px' }}>Protein</span>
          </div>

          {/* Carbs Ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MacroRing 
              percent={getPercent(macrosConsumedToday.carbs, nutritionTarget.carbs)} 
              value={macrosConsumedToday.carbs} 
              target={nutritionTarget.carbs} 
              unit="g" 
              color="#f59e0b"
            />
            <span style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '10px' }}>Carbohydrates</span>
          </div>

          {/* Fat Ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MacroRing 
              percent={getPercent(macrosConsumedToday.fat, nutritionTarget.fat)} 
              value={macrosConsumedToday.fat} 
              target={nutritionTarget.fat} 
              unit="g" 
              color="#ef4444"
            />
            <span style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '10px' }}>Fats</span>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '24px',
        alignItems: 'stretch'
      }}>
        {/* Log History */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Today's Food Log</h3>
          
          {todayEntries.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', minHeight: '200px' }}>
              No food logged today. Use the search panel on the right.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {todayEntries.map(entry => (
                <div key={entry.id} style={{
                  padding: '16px',
                  background: 'var(--bg-card-solid)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{entry.name}</h4>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      <span>P: {entry.macros.protein}g</span>
                      <span>C: {entry.macros.carbs}g</span>
                      <span>F: {entry.macros.fat}g</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--accent)', fontSize: '15px' }}>{entry.calories} kcal</span>
                    <button 
                      className="secondary" 
                      style={{ padding: '6px', minWidth: 'auto', borderRadius: '8px', border: 'none', background: 'transparent' }}
                      onClick={() => removeFoodEntry(entry.id)}
                    >
                      <Trash2 size={16} style={{ color: 'var(--error)' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logging Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main search card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Search & Log Food</h3>
              <button 
                className="secondary" 
                style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '6px' }}
                onClick={() => setIsCustomMode(!isCustomMode)}
              >
                {isCustomMode ? 'Search Preset' : 'Custom Meal'}
              </button>
            </div>

            {!isCustomMode ? (
              <>
                {/* Preset Search Mode */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search Indian foods (e.g. roti, paneer)..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedFood(null);
                    }}
                    style={{ paddingLeft: '44px' }}
                  />
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                </div>

                {/* Search Results List */}
                {searchResults.length > 0 && !selectedFood && (
                  <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    background: 'var(--bg-darker)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '8px'
                  }}>
                    {searchResults.map(item => (
                      <div
                        key={item.name}
                        onClick={() => handleSelectFood(item)}
                        style={{
                          padding: '10px 14px',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'background 0.2s ease',
                        }}
                        className="food-search-item"
                      >
                        <span style={{ fontSize: '14px' }}>{item.emoji} {item.name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.caloriesPer100g} kcal / 100g</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity Entry for selected preset food */}
                {selectedFood && (
                  <div className="animate-slide-up" style={{
                    padding: '16px',
                    background: 'var(--bg-darker)',
                    border: '1px solid var(--primary-glow)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontWeight: 'bold' }}>{selectedFood.emoji} {selectedFood.name}</h4>
                      <button className="secondary" style={{ padding: '4px 8px', fontSize: '10px' }} onClick={() => setSelectedFood(null)}>Cancel</button>
                    </div>
                    
                    {/* Servings calculator */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label style={{ margin: 0, textTransform: 'none' }}>Number of {selectedFood.servingUnit}s:</label>
                      <input
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(Math.max(0.1, parseFloat(e.target.value) || 0))}
                        style={{ width: '80px', padding: '8px' }}
                        step="0.5"
                      />
                    </div>

                    {/* Calculated metrics */}
                    <div style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.02)',
                      fontSize: '13px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Estimated Calories:</span>
                        <strong style={{ color: 'var(--primary)' }}>{getCaloriesForServings(selectedFood, qty)} kcal</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                        <span>Macros:</span>
                        <span>
                          P: {getMacrosForServings(selectedFood, qty).protein}g | 
                          C: {getMacrosForServings(selectedFood, qty).carbs}g | 
                          F: {getMacrosForServings(selectedFood, qty).fat}g
                        </span>
                      </div>
                    </div>

                    <button onClick={handleAddPredefined}>
                      Add to Log
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Custom Food Logging Form */
              <form onSubmit={handleAddCustom} className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label>Food Item Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Masala Omelette"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label>Calories (kcal)</label>
                    <input
                      type="number"
                      placeholder="e.g. 250"
                      value={customCals}
                      onChange={(e) => setCustomCals(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label>Protein (g)</label>
                    <input
                      type="number"
                      placeholder="e.g. 14"
                      value={customProt}
                      onChange={(e) => setCustomProt(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label>Carbs (g)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4"
                      value={customCarb}
                      onChange={(e) => setCustomCarb(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Fat (g)</label>
                    <input
                      type="number"
                      placeholder="e.g. 12"
                      value={customFat}
                      onChange={(e) => setCustomFat(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" style={{ marginTop: '10px' }}>
                  Log Custom Meal
                </button>
              </form>
            )}
          </div>

          {/* Smart Suggestions Card (Remaining Macro Matcher) */}
          {recommendations.length > 0 && (
            <div className="glass-card animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} style={{ color: 'var(--accent)' }} />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>Recommended for you</h3>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Items that fit your remaining protein and calorie goals:
              </p>

              <div style={{ display: 'grid', gap: '10px', marginTop: '4px' }}>
                {recommendations.map(item => (
                  <div key={item.name} style={{
                    padding: '12px',
                    background: 'var(--bg-darker)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{item.emoji} {item.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        1 serving: {getCaloriesForServings(item, 1)} kcal (P: {getMacrosForServings(item, 1).protein}g)
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddQuickRecommend(item)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '11px',
                        borderRadius: '6px',
                        gap: '4px',
                        boxShadow: 'none'
                      }}
                      className="accent"
                    >
                      <Plus size={12} /> Log
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MacroRing({ percent, value, target, unit, color }) {
  const size = 80;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth={strokeWidth}
        />
        {/* Active Percentage Stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
      {/* Absolute text container */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1.1
      }}>
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{Math.round(value)}</span>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>/ {Math.round(target)}{unit}</span>
      </div>
    </div>
  );
}
