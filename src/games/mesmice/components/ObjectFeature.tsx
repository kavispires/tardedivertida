import clsx from 'clsx';
// Ant Design Resources
import { Tooltip } from 'antd';
// Types
import type { ExtendedObjectFeatureCard } from '../utils/types';
// Images
import featuresIcons from './feature-icons.svg';
// Components
import { DualTranslate } from 'components/language';

type ObjectFeatureProps = {
  feature: ExtendedObjectFeatureCard;
  width?: number;
  highlight?: boolean;
  className?: string;
};

export function ObjectFeature({ feature, width = 48, highlight = false, className }: ObjectFeatureProps) {
  return (
    <Tooltip title={<DualTranslate>{feature.description}</DualTranslate>} placement="bottom">
      <div className={clsx('feature-card', highlight && 'feature-card--highlighted', className)}>
        <div className="category-icon" style={{ width: `${width}px`, height: `${width}px` }}>
          <svg viewBox="0 0 512 512" style={{ width: `${width}px`, height: `${width}px` }}>
            <use href={featuresIcons + `#${feature.id}`}></use>
          </svg>
        </div>
        <span className="feature-card__name">
          <DualTranslate>{feature.title}</DualTranslate>
        </span>
      </div>
    </Tooltip>
  );
}
