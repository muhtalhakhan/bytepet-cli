import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, PET_ART, SEC } from './constants';

const MOODS: Array<{ key: keyof typeof PET_ART.cat; label: string; color: string; emoji: string }> = [
  { key: 'happy',  label: 'Happy',  color: COLORS.green,   emoji: '😊' },
  { key: 'hungry', label: 'Hungry', color: COLORS.yellow,  emoji: '🍖' },
  { key: 'sleepy', label: 'Sleepy', color: COLORS.cyan,    emoji: '😴' },
  { key: 'sad',    label: 'Sad',    color: COLORS.gray,    emoji: '😢' },
];

// Each mood gets an equal slice of 3 seconds
const MOOD_FRAMES = Math.round((3 * SEC) / MOODS.length);

export const SceneMoods: React.FC = () => {
  const frame = useCurrentFrame();

  const moodIndex = Math.min(MOODS.length - 1, Math.floor(frame / MOOD_FRAMES));
  const localFrame = frame % MOOD_FRAMES;

  // Cross-fade between moods
  const fadeIn = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const mood = MOODS[moodIndex];
  const lines = PET_ART.cat[mood.key];

  // Title fades in once
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          color: COLORS.white,
          fontSize: 48,
          fontFamily: 'monospace',
          fontWeight: 700,
        }}
      >
        Your pet has moods
      </div>

      <div style={{ opacity: fadeIn, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {/* ASCII art */}
        <div style={{ fontFamily: 'monospace', lineHeight: 1.7 }}>
          {lines.map((line, i) => (
            <div key={i} style={{ color: mood.color, fontSize: 44, whiteSpace: 'pre' }}>
              {line}
            </div>
          ))}
        </div>

        {/* Mood label */}
        <div
          style={{
            color: mood.color,
            fontSize: 36,
            fontFamily: 'monospace',
            fontWeight: 700,
          }}
        >
          {mood.emoji} {mood.label}
        </div>
      </div>

      {/* Mood dots indicator */}
      <div style={{ display: 'flex', gap: 12 }}>
        {MOODS.map((m, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: i === moodIndex ? m.color : COLORS.dim,
              transition: 'none',
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
