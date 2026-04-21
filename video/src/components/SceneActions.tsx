import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, SEC } from './constants';

type ActionCardProps = {
  emoji: string;
  key_: string;
  label: string;
  effect: string;
  xp: string;
  delay: number;
  accentColor: string;
};

const ActionCard: React.FC<ActionCardProps> = ({
  emoji,
  key_,
  label,
  effect,
  xp,
  delay,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12 },
  });

  const scale = interpolate(progress, [0, 1], [0.6, 1]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        backgroundColor: COLORS.terminal,
        border: `2px solid ${accentColor}`,
        borderRadius: 16,
        padding: '36px 44px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        width: 380,
        fontFamily: 'monospace',
      }}
    >
      <div style={{ fontSize: 64 }}>{emoji}</div>
      <div style={{ color: accentColor, fontSize: 28, fontWeight: 700 }}>
        <span style={{ color: COLORS.white }}>[</span>
        {key_}
        <span style={{ color: COLORS.white }}>]</span>{' '}
        {label}
      </div>
      <div style={{ color: COLORS.gray, fontSize: 20 }}>{effect}</div>
      <div
        style={{
          color: COLORS.magenta,
          fontSize: 18,
          backgroundColor: '#1f1740',
          padding: '4px 16px',
          borderRadius: 8,
        }}
      >
        {xp}
      </div>
    </div>
  );
};

export const SceneActions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 0.5 * SEC], [0, 1], {
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
        gap: 60,
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          color: COLORS.white,
          fontSize: 48,
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: 2,
        }}
      >
        What can you do?
      </div>

      <div style={{ display: 'flex', gap: 40 }}>
        <ActionCard
          emoji="🍖"
          key_="f"
          label="Feed"
          effect="Hunger +30  Happiness +5"
          xp="+10 XP"
          delay={0.3 * SEC}
          accentColor={COLORS.green}
        />
        <ActionCard
          emoji="💤"
          key_="s"
          label="Sleep"
          effect="Energy +40  Health +5"
          xp="+5 XP"
          delay={0.7 * SEC}
          accentColor={COLORS.cyan}
        />
        <ActionCard
          emoji="🎮"
          key_="p"
          label="Play"
          effect="Rock Paper Scissors!"
          xp="+5–15 XP"
          delay={1.1 * SEC}
          accentColor={COLORS.magenta}
        />
      </div>
    </AbsoluteFill>
  );
};
