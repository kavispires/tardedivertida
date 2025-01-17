import { Avatar, Tooltip } from 'antd';
import type { ReactNode } from 'react';

type BettingChipValueProps = {
  value: number;
  title?: ReactNode;
};

const COLORS: StringDictionary = {
  0: '#c3c3c3',
  1: '#d2bc6c',
  2: '#d4bb60',
  3: '#d6ba55',
  4: '#d8b949',
  5: '#dab83e',
  6: '#dcb732',
  7: '#d29639',
  8: '#c87540',
  9: '#be5347',
  10: '#b4324e',
};

export function BettingChipValue({ value, title }: BettingChipValueProps) {
  if (title) {
    return (
      <Tooltip title={title}>
        <Avatar size="small" style={{ background: COLORS[value] }}>
          {value ?? 0}
        </Avatar>
      </Tooltip>
    );
  }

  return (
    <Avatar size="small" style={{ background: COLORS[value] }}>
      {value ?? 0}
    </Avatar>
  );
}
