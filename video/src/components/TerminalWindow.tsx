import React from 'react';
import { COLORS } from './constants';

type Props = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const TerminalWindow: React.FC<Props> = ({ children, style }) => {
  return (
    <div
      style={{
        backgroundColor: COLORS.terminal,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        fontFamily: '"Courier New", Courier, monospace',
        ...style,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          backgroundColor: '#21262d',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#f85149' }} />
        <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#d29922' }} />
        <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#3fb950' }} />
        <span style={{ color: COLORS.gray, fontSize: 14, marginLeft: 8 }}>
          byte — terminal
        </span>
      </div>
      {/* Content */}
      <div style={{ padding: '32px 40px' }}>{children}</div>
    </div>
  );
};
