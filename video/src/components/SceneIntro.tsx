import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, SEC } from './constants';
import { Typewriter } from './Typewriter';

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ⚡ icon springs in
  const iconScale = spring({ frame, fps, config: { damping: 8 } });

  // "bytepet-cli" slides up after 0.4s
  const titleProgress = spring({
    frame: frame - Math.round(0.4 * fps),
    fps,
    config: { damping: 200 },
  });
  const titleY = interpolate(titleProgress, [0, 1], [60, 0]);
  const titleOpacity = titleProgress;

  // Tagline typewriter starts at 1.2s
  const TAGLINE_START = Math.round(1.2 * fps);

  // Bottom hint fades in at 3s
  const hintOpacity = interpolate(frame, [3 * SEC, 3.5 * SEC], [0, 1], {
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
        gap: 24,
      }}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: 100,
          transform: `scale(${iconScale})`,
          lineHeight: 1,
        }}
      >
        ⚡
      </div>

      {/* Title */}
      <div
        style={{
          color: COLORS.cyan,
          fontSize: 96,
          fontWeight: 800,
          fontFamily: '"Courier New", monospace',
          letterSpacing: 4,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        bytepet-cli
      </div>

      {/* Tagline */}
      <div style={{ fontSize: 36, color: COLORS.gray, fontFamily: 'monospace', minHeight: 50 }}>
        <Typewriter
          text="A terminal pet that lives in your CLI — feed it, play with it, watch it grow."
          startFrame={TAGLINE_START}
          charFrames={2}
        />
      </div>

      {/* Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          fontSize: 24,
          color: COLORS.dim,
          fontFamily: 'monospace',
          opacity: hintOpacity,
        }}
      >
        npm install -g bytepet-cli
      </div>
    </AbsoluteFill>
  );
};
