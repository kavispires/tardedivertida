import clsx from 'clsx';
import { useState } from 'react';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { AvatarIcon } from '..';
import { Translate, translate } from '../shared';

type FloatingHandProps = {
  children: any;
  subtitle?: any;
};

export function FloatingHand({ children, subtitle = '' }: FloatingHandProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const language = useLanguage();

  return (
    <>
      <div className="floating-hand-added-white-space"></div>
      <div
        className={clsx('floating-hand', isExpanded && 'floating-hand--expanded')}
        onMouseOver={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <span className="floating-hand__label">
          <AvatarIcon
            type="hand-of-cards"
            size={isExpanded ? 40 : 60}
            className="floating-hand__icon"
            alt={translate('Mão de Cartas', 'Hand of Cards', language)}
          />
          <Translate pt="Passe o mouse para expandir " en="Hover to expand " />
          {subtitle}
        </span>
        {children}
      </div>
    </>
  );
}
