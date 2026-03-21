import type { SegmentedOptions } from 'antd/es/segmented';
import clsx from 'clsx';
// Ant Design Resources
import { Segmented, type SegmentedProps } from 'antd';

type TripleStateButtonProps = {
  /**
   * Current value of the button (true, false, or null for neutral)
   */
  value: boolean | null;
  /**
   * Callback function triggered when the value changes
   */
  onChange: (value: boolean | null) => void;
  /**
   * Custom icons for each state (true, false, null)
   */
  icons?: {
    /**
     * Icon for the true state
     */
    true?: React.ReactNode;
    /**
     * Icon for the false state
     */
    false?: React.ReactNode;
    /**
     * Icon for the null state
     */
    null?: React.ReactNode;
  };
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Custom options to override the default three-state options
   */
  options?: SegmentedOptions<boolean | null>;
} & Omit<SegmentedProps<boolean | null>, 'onChange' | 'value' | 'options'>;

/**
 * A three-state button component that allows users to select between true, false, or null (neutral) states.
 * Built on top of Ant Design's Segmented component with custom styling for each state.
 */
export function TripleStateButton({
  value,
  onChange,
  disabled,
  icons,
  shape,
  size,
  options,
  ...rest
}: TripleStateButtonProps) {
  return (
    <Segmented
      onChange={(value) => onChange(value as boolean | null)}
      options={
        options ?? [
          {
            value: false,
            icon: icons?.false ?? '👎',
            className: clsx({ 'color-background--red': value === false }),
          },
          { value: null, icon: icons?.null ?? '▫️' },
          {
            value: true,
            icon: icons?.true ?? '👍',
            className: clsx({ 'color-background--green': value === true }),
          },
        ]
      }
      shape={shape ?? 'round'}
      size={size ?? 'large'}
      value={value}
      disabled={disabled}
      {...rest}
    />
  );
}
