import { ReactNode } from 'react';
// Ant Design Resources
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

type FilterEntryProps = {
  label: ReactNode;
  /**
   * The content of the component
   */
  children: ReactNode;
  tooltip?: ReactNode;
};

export function FilterEntry({ label, tooltip, children }: FilterEntryProps) {
  return (
    <div className="showcase-filter-entry">
      <label className="showcase-filter-entry__label">
        {label}
        {Boolean(tooltip) && (
          <Tooltip title={tooltip}>
            <Button type="text" shape="circle" icon={<InfoCircleOutlined />} size="small" />
          </Tooltip>
        )}
      </label>
      <div className="showcase-filter-entry__content">{children}</div>
    </div>
  );
}
