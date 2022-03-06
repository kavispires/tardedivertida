import clsx from 'clsx';
// Ant Design Resources
import { StarFilled } from '@ant-design/icons';
// Components
import { Translate } from './Translate';

type StarPointsProps = {
  keyPrefix: string;
  quantity?: number;
  className?: string;
};

export const StarPoints = ({ keyPrefix, quantity, className }: StarPointsProps) => {
  if (!quantity || quantity < 1) {
    return <span />;
  }

  const StarsArray = Array.from({ length: quantity }, (_, i) => <StarFilled key={`${keyPrefix}-${i}`} />);

  return (
    <span className={clsx('star-points', className)}>
      + <span className="star-points__stars">{StarsArray}</span> <Translate pt="ponto" en="point" />
      {quantity > 1 ? 's' : ''}
    </span>
  );
};
