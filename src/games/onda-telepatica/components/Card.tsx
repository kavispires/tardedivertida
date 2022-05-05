import clsx from 'clsx';
// Ant Design Resources
import { ArrowLeftOutlined, ArrowRightOutlined, MinusOutlined } from '@ant-design/icons';
// Helpers
import { getColorModifier } from '../utils/helpers';

type CardProps = {
  left: string;
  right: string;
  className?: string;
  setNeedle?: GenericFunction;
};

export function Card({ left, right, className = '', setNeedle }: CardProps) {
  const leftColor = getColorModifier(left[0]);
  const rightColor = getColorModifier(right[0]);
  const cardSideClass = 'o-card__side';
  const isButton = Boolean(setNeedle);

  const onSetNeedle = (direction: number) => {
    if (setNeedle) {
      if (direction === 1) {
        setNeedle((n: number) => Math.min(n + direction, 10));
      } else {
        setNeedle((n: number) => Math.max(n + direction, -10));
      }
    }
  };

  return (
    <div className={clsx('o-card', className)}>
      <div
        className={clsx(
          cardSideClass,
          `${cardSideClass}--left`,
          `${cardSideClass}--L${leftColor}`,
          isButton && `${cardSideClass}--button`
        )}
        onClick={() => onSetNeedle(-1)}
      >
        <span className="o-card__arrow">
          <ArrowLeftOutlined /> <MinusOutlined /> <MinusOutlined />
        </span>
        <span className="o-card__text">{left}</span>
      </div>
      <div
        className={clsx(
          cardSideClass,
          `${cardSideClass}--right`,
          `${cardSideClass}--R${rightColor}`,
          isButton && `${cardSideClass}--button`
        )}
        onClick={() => onSetNeedle(1)}
      >
        <span className="o-card__arrow">
          <MinusOutlined /> <MinusOutlined /> <ArrowRightOutlined />
        </span>
        <span className="o-card__text">{right}</span>
      </div>
    </div>
  );
}
