import clsx from 'clsx';
// Utils
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
