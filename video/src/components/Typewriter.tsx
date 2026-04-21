import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from './constants';

type Props = {
  text: string;
  startFrame: number;
  charFrames?: number;
  style?: React.CSSProperties;
  cursorColor?: string;
  showCursor?: boolean;
};

export const Typewriter: React.FC<Props> = ({
  text,
  startFrame,
  charFrames = 2,
  style,
  cursorColor = COLORS.cyan,
  showCursor = true,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - startFrame);
  const charsVisible = Math.min(text.length, Math.floor(localFrame / charFrames));
  const displayed = text.slice(0, charsVisible);

  const BLINK = 16;
  const cursorOpacity = interpolate(
    frame % BLINK,
    [0, BLINK / 2, BLINK],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <span style={{ fontFamily: 'monospace', ...style }}>
      {displayed}
      {showCursor && (
        <span style={{ opacity: cursorOpacity, color: cursorColor }}>▌</span>
      )}
    </span>
  );
};
