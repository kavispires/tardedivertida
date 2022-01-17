import clsx from 'clsx';
import { useState } from 'react';
// Components
import { Translate } from '../shared';

type FloatingHandProps = {
  children: any;
  subtitle?: any;
};

export function FloatingHand({ children, subtitle = '' }: FloatingHandProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="floating-hand-added-white-space"></div>
      <div
        className={clsx('floating-hand', isExpanded && 'floating-hand--expanded')}
        onMouseOver={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <span className="floating-hand__label">
          <Translate pt="Passe o mouse para expandir " en="Hover to expand " />
          {subtitle}
        </span>
        {children}
      </div>
    </>
  );
}
