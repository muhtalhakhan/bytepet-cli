import React from 'react';
import { interpolate } from 'remotion';
import { COLORS } from './constants';

type Props = {
  label: string;
  emoji: string;
  value: number;   // 0–100
  progress: number; // 0–1 animation progress
};

export const StatBar: React.FC<Props> = ({ label, emoji, value, progress }) => {
  const TOTAL_BLOCKS = 10;
  const filled = Math.round((value / 100) * TOTAL_BLOCKS * progress);
  const empty = TOTAL_BLOCKS - filled;

  const barColor =
    value > 60 ? COLORS.green :
    value > 30 ? COLORS.yellow :
    COLORS.red;

  const displayPct = Math.round(value * progress);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
      <span style={{ fontSize: 22, width: 28 }}>{emoji}</span>
      <span style={{ color: COLORS.white, fontSize: 20, width: 110, fontFamily: 'monospace' }}>
        {label}
      </span>
      <span style={{ color: barColor, fontSize: 20, letterSpacing: 2, fontFamily: 'monospace' }}>
        {'█'.repeat(filled)}
      </span>
      <span style={{ color: COLORS.dim, fontSize: 20, letterSpacing: 2, fontFamily: 'monospace' }}>
        {'░'.repeat(empty)}
      </span>
      <span style={{ color: COLORS.gray, fontSize: 18, fontFamily: 'monospace', width: 50 }}>
        {displayPct}%
      </span>
    </div>
  );
};
