import clsx from 'clsx';
// Ant Design Resources
import { Segmented } from 'antd';

type TripleStateButtonProps = {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
  disabled?: boolean;
};

export function TripleStateButton({ value, onChange, disabled }: TripleStateButtonProps) {
  return (
    <Segmented
      onChange={(value) => onChange(value as boolean | null)}
      options={[
        { value: false, icon: '👎', className: clsx({ 'color-background--red': value === false }) },
        { value: null, icon: '▫️' },
        { value: true, icon: '👍', className: clsx({ 'color-background--green': value === true }) },
      ]}
      shape="round"
      size="large"
      value={value}
      disabled={disabled}
    />
  );
}
