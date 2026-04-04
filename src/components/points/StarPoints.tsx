import clsx from 'clsx';
// Ant Design Resources
import { StarFilled } from '@ant-design/icons';
// Components
import { Translate } from 'components/language/Translate';
// Sass
import styles from './StarPoints.module.scss';

type StarPointsProps = {
  /**
   * A unique key prefix for star elements
   */
  keyPrefix: string;
  /**
   * The number of star points (negative values show as red)
   */
  quantity?: number;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Whether to hide the numeric text
   */
  hideText?: boolean;
};

export const StarPoints = ({ keyPrefix, quantity, className, hideText }: StarPointsProps) => {
  if (!quantity) {
    return <span />;
  }

  const isNegative = quantity < 0;
  const num = Math.abs(quantity);

  const StarsArray = Array.from({ length: num }, (_, i) => <StarFilled key={`${keyPrefix}-${i}`} />);

  return (
    <span className={clsx(styles.starPoints, isNegative && styles.starPointsNegative, className)}>
      {isNegative ? '-' : '+'} <span className={styles.stars}>{StarsArray}</span>
      {!hideText && (
        <>
          <Translate
            pt="ponto"
            en="point"
          />
          {num > 1 ? 's' : ''}
        </>
      )}
    </span>
  );
};
