import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, SEC } from './constants';
import { Typewriter } from './Typewriter';
import { TerminalWindow } from './TerminalWindow';

export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Terminal window springs in
  const windowProgress = spring({ frame, fps, config: { damping: 200 } });
  const windowY = interpolate(windowProgress, [0, 1], [60, 0]);

  // npm command types out from frame 0
  const INSTALL_CHARS = 'npm install -g bytepet-cli'.length * 2; // ~52 frames

  // "byte" prompt appears after install line is done
  const BYTE_START = INSTALL_CHARS + 0.5 * SEC;

  // Logo fades in at the end
  const logoOpacity = interpolate(frame, [2.2 * SEC, 2.8 * SEC], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const logoScale = spring({
    frame: frame - Math.round(2.2 * SEC),
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 48,
      }}
    >
      {/* Terminal */}
      <div style={{ transform: `translateY(${windowY}px)`, width: 860 }}>
        <TerminalWindow>
          <div style={{ fontSize: 26, lineHeight: 2.2, fontFamily: 'monospace' }}>
            {/* npm install line */}
            <div>
              <span style={{ color: COLORS.green }}>~</span>
              <span style={{ color: COLORS.gray }}> $ </span>
              <Typewriter
                text="npm install -g bytepet-cli"
                startFrame={0}
                charFrames={2}
                style={{ color: COLORS.white }}
                cursorColor={COLORS.cyan}
              />
            </div>

            {/* byte command */}
            {frame >= BYTE_START && (
              <div>
                <span style={{ color: COLORS.green }}>~</span>
                <span style={{ color: COLORS.gray }}> $ </span>
                <Typewriter
                  text="byte"
                  startFrame={BYTE_START}
                  charFrames={4}
                  style={{ color: COLORS.white }}
                  cursorColor={COLORS.cyan}
                />
              </div>
            )}
          </div>
        </TerminalWindow>
      </div>

      {/* Closing logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ fontSize: 56 }}>⚡</div>
        <div
          style={{
            color: COLORS.cyan,
            fontSize: 52,
            fontWeight: 800,
            fontFamily: 'monospace',
            letterSpacing: 3,
          }}
        >
          bytepet-cli
        </div>
        <div style={{ color: COLORS.gray, fontSize: 22, fontFamily: 'monospace' }}>
          github.com/muhtalhakhan/bytepet-cli
        </div>
      </div>
    </AbsoluteFill>
  );
};
