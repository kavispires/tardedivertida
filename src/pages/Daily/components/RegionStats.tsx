import type { ReactNode } from 'react';
// Ant Design Resources
import { Divider, Space, Tooltip } from 'antd';
// Components
import { Icon } from '@components/general/Icon';
import { DualTranslate } from '@components/language/DualTranslate';

type Stat = {
  key: string;
  label: string | number;
  tooltip: DualLanguageValue;
  icon: ReactNode;
};

type RegionStatsProps = {
  stats: Stat[];
};

/**
 * Component to display a list of stats with icons and tooltips in a horizontal layout, separated by dividers.
 * @param stats - An array of stat objects, each containing a key, label, tooltip, and icon.
 * @returns
 */
export function RegionStats({ stats }: RegionStatsProps) {
  return (
    <Space
      size="small"
      separator={<Divider orientation="vertical" />}
    >
      {stats.map(({ key, label, tooltip, icon }) => (
        <Tooltip
          key={key}
          title={<DualTranslate>{tooltip}</DualTranslate>}
        >
          <Icon
            icon={icon}
            size="small"
          />{' '}
          {label}
        </Tooltip>
      ))}
    </Space>
  );
}
