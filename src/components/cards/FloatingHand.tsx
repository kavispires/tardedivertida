import clsx from 'clsx';
import { ReactNode, useState } from 'react';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { HandOfCardsIcon } from 'icons/HandOfCardsIcon';
// Components
import { Translate } from 'components/language';
import { IconAvatar } from 'components/avatars';

type FloatingHandProps = {
  /**
   * The content of the floating hand
   */
  children: ReactNode;
  /**
   * The title of the floating hand
   */
  title?: ReactNode;
  /**
   * The icon (default: Hand of Cards)
   */
  icon?: ReactNode;
};

export function FloatingHand({ children, icon, title }: FloatingHandProps) {
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
        <h3 className="floating-hand__label">
          <IconAvatar
            icon={icon ?? <HandOfCardsIcon />}
            size={isExpanded ? 30 : 40}
            className="floating-hand__icon"
            alt={translate('Mão de Cartas', 'Hand of Cards')}
          />
          <span className="floating-hand__label-text">
            {title ?? <Translate pt="Suas Cartas" en="Your Cards" />}
            <span className="floating-hand__label-text-hint">
              (<Translate pt="Passe o mouse para expandir" en="Hover to expand" />)
            </span>
          </span>
        </h3>
        <div className="floating-hand__children">{children}</div>
      </div>
    </>
  );
}
