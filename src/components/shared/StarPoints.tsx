import clsx from 'clsx';
// Ant Design Resources
import { StarFilled } from '@ant-design/icons';
// Components
import { Translate } from './Translate';

type StarPointsProps = {
  keyPrefix: string;
  quantity?: number;
  className?: string;
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
    <span className={clsx('star-points', isNegative && 'star-points--negative', className)}>
      {isNegative ? '-' : '+'} <span className="star-points__stars">{StarsArray}</span>
      {!hideText && (
        <>
          <Translate pt="ponto" en="point" />
          {num > 1 ? 's' : ''}
        </>
      )}
    </span>
  );
};
