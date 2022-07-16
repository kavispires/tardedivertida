import clsx from 'clsx';
import { ReactNode, useState } from 'react';
// Hooks
import { useLanguage } from 'hooks';
// Components
import { AvatarIcon } from 'components/avatars';
import { Translate } from 'components/language';

type FloatingHandProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  type?: 'hand' | 'stats';
  subtitle?: any;
};

export function FloatingHand({ children, subtitle = '', type = 'hand' }: FloatingHandProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { translate } = useLanguage();

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
            type={type === 'hand' ? 'hand-of-cards' : 'user-stats'}
            size={isExpanded ? 40 : 60}
            className="floating-hand__icon"
            alt={translate('Mão de Cartas', 'Hand of Cards')}
          />
          <Translate pt="Passe o mouse para expandir " en="Hover to expand " />
          {subtitle}
        </span>
        {children}
      </div>
    </>
  );
}
