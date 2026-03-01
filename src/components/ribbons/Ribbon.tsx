import clsx from 'clsx';
// Utils
import { getAnimationClass, getColorFromLetter } from 'utils/helpers';
// Sass
import styles from './Ribbons.module.scss';

type RibbonProps = {
  /**
   * The text label to display on the ribbon
   */
  label: string;
  /**
   * The CSS position of the ribbon
   */
  position?: 'absolute' | 'static';
};

export function Ribbon({ label, position = 'absolute' }: RibbonProps) {
  return (
    <div className={clsx(styles.ribbon, position === 'absolute' && styles.ribbonAbsolute)}>
      <div
        className={clsx(
          styles.ribbonContent,
          `ribbon__content--${label}`,
          `color-background--${getColorFromLetter(label)}`,
          getAnimationClass('bounceIn'),
        )}
      >
        {label}
      </div>
    </div>
  );
}
