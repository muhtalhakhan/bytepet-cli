import React from 'react';
import { interpolate } from 'remotion';
import { COLORS } from './constants';

type Props = {
  lines: string[];
  progress: number; // 0–1, reveals lines one by one
  color?: string;
};

export const AsciiPet: React.FC<Props> = ({ lines, progress, color = COLORS.yellow }) => {
  const visibleCount = Math.floor(progress * lines.length + 1);

  return (
    <div style={{ fontFamily: 'monospace', lineHeight: 1.6 }}>
      {lines.map((line, i) => {
        const lineProgress = interpolate(
          progress,
          [i / lines.length, (i + 1) / lines.length],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );
        return (
          <div
            key={i}
            style={{
              color,
              fontSize: 32,
              opacity: lineProgress,
              transform: `translateX(${interpolate(lineProgress, [0, 1], [-20, 0])}px)`,
              whiteSpace: 'pre',
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};
