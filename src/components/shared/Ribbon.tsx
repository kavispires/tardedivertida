// Utils
import clsx from 'clsx';
import { getAnimationClass, getColorFromLetter } from 'utils/helpers';

type RibbonProps = {
  label: string;
  position?: 'absolute' | 'static';
};

export function Ribbon({ label, position = 'absolute' }: RibbonProps): JSX.Element {
  return (
    <div className={clsx('ribbon', `ribbon--${position}`)}>
      <div
        className={clsx(
          'ribbon__content',
          `ribbon__content--${label}`,
          `color-background--${getColorFromLetter(label)}`,
          getAnimationClass('bounceIn')
        )}
      >
        {label}
      </div>
    </div>
  );
}

type RibbonGroupProps = {
  labels: string[];
};

export function RibbonGroup({ labels }: RibbonGroupProps) {
  return (
    <div className="ribbon-group ribbon--absolute">
      {labels.length > 0 &&
        labels.map((label) => (
          <Ribbon
            key={label}
            label={label.length > 0 ? label.charAt(label.length - 1) : label}
            position="static"
          />
        ))}
    </div>
  );
}
