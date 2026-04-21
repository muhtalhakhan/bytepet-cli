import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, PET_ART, SEC } from './constants';
import { AsciiPet } from './AsciiPet';
import { StatBar } from './StatBar';
import { TerminalWindow } from './TerminalWindow';

export const SceneReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Terminal window slides up
  const windowProgress = spring({ frame, fps, config: { damping: 200 } });
  const windowY = interpolate(windowProgress, [0, 1], [80, 0]);

  // ASCII art starts appearing at 0.5s, completes at 2s
  const artProgress = interpolate(frame, [0.5 * SEC, 2 * SEC], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Name/level fades in at 2s
  const nameOpacity = interpolate(frame, [2 * SEC, 2.5 * SEC], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Stat bars fill from 2.2s to 4s
  const statsProgress = interpolate(frame, [2.2 * SEC, 4 * SEC], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Actions row fades in at 4s
  const actionsOpacity = interpolate(frame, [4 * SEC, 4.5 * SEC], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ transform: `translateY(${windowY}px)`, width: 900 }}>
        <TerminalWindow>
          {/* Header */}
          <div style={{ marginBottom: 16, opacity: nameOpacity }}>
            <span
              style={{
                color: COLORS.cyan,
                fontFamily: 'monospace',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              ⚡ byte-cli
            </span>
          </div>

          {/* ASCII cat */}
          <AsciiPet lines={PET_ART.cat.happy} progress={artProgress} />

          {/* Name + level */}
          <div
            style={{
              opacity: nameOpacity,
              marginTop: 12,
              marginBottom: 20,
              fontFamily: 'monospace',
            }}
          >
            <span style={{ color: COLORS.white, fontWeight: 700, fontSize: 22 }}>
              Pixel the Cat
            </span>
            <span style={{ color: COLORS.gray, fontSize: 22 }}> · </span>
            <span style={{ color: COLORS.magenta, fontSize: 22 }}>Level 3</span>
            <span style={{ color: COLORS.gray, fontSize: 22 }}> · </span>
            <span style={{ color: COLORS.dim, fontSize: 20 }}>245/300 XP</span>
          </div>

          {/* Stat bars */}
          <StatBar label="Health   " emoji="❤️" value={100} progress={statsProgress} />
          <StatBar label="Hunger   " emoji="🍖" value={70}  progress={statsProgress} />
          <StatBar label="Happiness" emoji="😊" value={80}  progress={statsProgress} />
          <StatBar label="Energy   " emoji="⚡" value={55}  progress={statsProgress} />

          {/* Actions */}
          <div
            style={{
              marginTop: 20,
              opacity: actionsOpacity,
              fontFamily: 'monospace',
              fontSize: 20,
              color: COLORS.gray,
              borderTop: `1px solid ${COLORS.border}`,
              paddingTop: 16,
            }}
          >
            <span style={{ color: COLORS.cyan }}>[f]</span> Feed{'   '}
            <span style={{ color: COLORS.cyan }}>[p]</span> Play{'   '}
            <span style={{ color: COLORS.cyan }}>[s]</span> Sleep{'   '}
            <span style={{ color: COLORS.cyan }}>[q]</span> Quit
          </div>
        </TerminalWindow>
      </div>
    </AbsoluteFill>
  );
};
