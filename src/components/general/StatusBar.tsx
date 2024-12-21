import { Fragment, type ReactNode } from 'react';
import { Divider, Tooltip } from 'antd';

import './StatusBar.scss';

export type StatusEntry = {
  key: string;
  title: ReactNode;
  value: ReactNode;
};

type StatusBarProps = {
  entries: StatusEntry[];
  title?: ReactNode;
};

export function StatusBar({ entries, title }: StatusBarProps) {
  return (
    <div className="status-bar">
      {title && <h3 className="status-bar__title">{title}</h3>}
      {entries.map((entry, index, arr) => (
        <Fragment key={entry.key}>
          <Tooltip title={entry.title}>
            <div>{entry.value}</div>
          </Tooltip>
          {index < arr.length - 1 && <Divider type="vertical" />}
        </Fragment>
      ))}
    </div>
  );
}
