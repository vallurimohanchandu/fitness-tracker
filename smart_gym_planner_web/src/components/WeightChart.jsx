import React, { useState } from 'react';

export default function WeightChart({ entries }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!entries || entries.length < 2) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        gap: '8px'
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
        <span style={{ fontSize: '13px' }}>Add at least 2 entries to display trend chart</span>
      </div>
    );
  }

  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const weights = entries.map(e => e.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW;
  const pad = range === 0 ? 2 : range * 0.15;
  const chartMin = minW - pad;
  const chartMax = maxW + pad;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const stepX = chartWidth / (entries.length - 1);

  const getCoords = (index) => {
    const entry = entries[index];
    const x = paddingX + index * stepX;
    const ratioY = (entry.weight - chartMin) / (chartMax - chartMin);
    const y = height - paddingY - (ratioY * chartHeight);
    return { x, y };
  };

  const points = entries.map((_, i) => getCoords(i));

  // Build path using cubic-bezier curves for a smooth look
  let linePath = '';
  let fillPath = '';

  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    fillPath = `M ${points[0].x} ${height - paddingY} L ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      const prev = points[i - 1];
      
      const cpX1 = prev.x + (p.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (p.x - prev.x) / 2;
      const cpY2 = p.y;

      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
      fillPath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
    }

    fillPath += ` L ${points[points.length - 1].x} ${height - paddingY} Z`;
  }

  // Define 4 grid lines
  const gridLines = [];
  for (let i = 0; i < 4; i++) {
    const val = chartMin + (i * (chartMax - chartMin)) / 3;
    const y = height - paddingY - (i * chartHeight) / 3;
    gridLines.push({ y, val: val.toFixed(1) });
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        <defs>
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines and Y-axis labels */}
        {gridLines.map((line, idx) => (
          <g key={idx}>
            <line 
              x1={paddingX} 
              y1={line.y} 
              x2={width - paddingX} 
              y2={line.y} 
              stroke="var(--border-color)" 
              strokeWidth="1" 
              strokeDasharray="4 4"
            />
            <text 
              x={paddingX - 10} 
              y={line.y + 4} 
              fill="var(--text-muted)" 
              fontSize="10" 
              fontFamily="var(--font-body)"
              textAnchor="end"
            >
              {line.val}
            </text>
          </g>
        ))}

        {/* Gradient fill under the trend line */}
        {fillPath && (
          <path d={fillPath} fill="url(#chartGlow)" />
        )}

        {/* The glowing trend line */}
        {linePath && (
          <path 
            d={linePath} 
            fill="none" 
            stroke="var(--primary)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            style={{ filter: 'drop-shadow(0px 4px 8px var(--primary-glow))' }}
          />
        )}

        {/* Data points */}
        {points.map((pt, idx) => {
          const entry = entries[idx];
          const isHovered = hoveredPoint === idx;

          return (
            <g key={entry.id}>
              {/* Invisible larger hover trigger */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="12"
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredPoint(idx)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* Outer glow ring on hover */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 8 : 6}
                fill="var(--primary-glow)"
                opacity={isHovered ? 1 : 0}
                style={{ transition: 'r 0.15s ease, opacity 0.15s ease' }}
              />
              {/* Core dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 5.5 : 4}
                fill="var(--primary)"
                stroke="var(--bg-dark)"
                strokeWidth="1.5"
                style={{ transition: 'r 0.15s ease' }}
              />
            </g>
          );
        })}

        {/* X-axis date labels */}
        {entries.map((entry, idx) => {
          if (idx === 0 || idx === entries.length - 1 || (entries.length > 5 && idx % Math.round(entries.length / 3) === 0)) {
            const pt = points[idx];
            const dateObj = new Date(entry.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            return (
              <text
                key={entry.id}
                x={pt.x}
                y={height - 8}
                fill="var(--text-muted)"
                fontSize="10"
                fontFamily="var(--font-body)"
                textAnchor="middle"
              >
                {formattedDate}
              </text>
            );
          }
          return null;
        })}
      </svg>

      {/* Floating HTML tooltip */}
      {hoveredPoint !== null && (
        <div style={{
          position: 'absolute',
          left: `${(points[hoveredPoint].x / width) * 100}%`,
          top: `${(points[hoveredPoint].y / height) * 100 - 32}%`,
          transform: 'translateX(-50%)',
          background: 'var(--bg-card-solid)',
          border: '1px solid var(--primary)',
          borderRadius: '6px',
          padding: '4px 8px',
          fontSize: '11px',
          fontWeight: 'bold',
          color: '#fff',
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 10,
        }}>
          {entries[hoveredPoint].weight.toFixed(1)} kg
        </div>
      )}
    </div>
  );
}
