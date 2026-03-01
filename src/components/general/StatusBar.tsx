import { Fragment, type ReactNode } from 'react';
// Ant Design Resources
import { Divider, Tooltip } from 'antd';
// Sass
import styles from './StatusBar.module.scss';

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
    <div className={styles.statusBar}>
      {title && <h3 className={styles.statusBarTitle}>{title}</h3>}
      {entries.map((entry, index, arr) => (
        <Fragment key={entry.key}>
          <Tooltip title={entry.title}>
            <div>{entry.value}</div>
          </Tooltip>
          {index < arr.length - 1 && <Divider orientation="vertical" />}
        </Fragment>
      ))}
    </div>
  );
}
