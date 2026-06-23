import clsx from 'clsx';
import { type ReactNode, useState } from 'react';
import { useMeasure, useToggle } from 'react-use';
// Ant Design Resources
import { Drawer } from 'antd';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Icons
import { HandOfCardsIcon } from '@icons/HandOfCardsIcon';
// Components
import { DivButton } from '@components/buttons/DivButton';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
// Sass
import styles from './FloatingHand.module.scss';

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

/**
 * Component that displays a floating expandable hand of cards at the bottom of the screen
 */
export function FloatingHand({ children, icon, title }: FloatingHandProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { translate } = useLanguage();

  return (
    <>
      <div className={styles.floatingHandAddedWhiteSpace}></div>
      <DivButton
        className={clsx(styles.floatingHand, isExpanded && styles.floatingHandExpanded)}
        onMouseOver={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => setIsExpanded(false)}
      >
        <h3 className={styles.floatingHandLabel}>
          <Icon
            icon={icon ?? <HandOfCardsIcon />}
            size={isExpanded ? 30 : 40}
            className={styles.floatingHandIcon}
            alt={translate({ pt: 'Mão de Cartas', en: 'Hand of Cards' })}
          />
          <span className={styles.floatingHandLabelText}>
            {title ?? (
              <Translate
                pt="Suas Cartas"
                en="Your Cards"
              />
            )}
            <span className={styles.floatingHandLabelTextHint}>
              (
              <Translate
                pt="Passe o mouse para expandir"
                en="Hover to expand"
              />
              )
            </span>
          </span>
        </h3>
        <div className={styles.floatingHandChildren}>{children}</div>
      </DivButton>
    </>
  );
}

/**
 * Drawer variant of FloatingHand that opens in a side drawer instead of expanding in place
 */
export function FloatingHandDrawer({ children, icon, title }: FloatingHandProps) {
  const [open, toggleDrawer] = useToggle(false);
  const { translate } = useLanguage();
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  return (
    <>
      <div className={styles.floatingHandDrawerWhiteSpace} />
      <button
        type="button"
        className={styles.floatingHandDrawerButton}
        onClick={toggleDrawer}
        onMouseOver={() => toggleDrawer(true)}
        onFocus={() => toggleDrawer(true)}
      >
        <span className={styles.floatingHandDrawerLabel}>
          <Icon
            icon={icon ?? <HandOfCardsIcon />}
            className={styles.floatingHandDrawerIcon}
            alt={translate({ pt: 'Mão de Cartas', en: 'Hand of Cards' })}
          />
          <span className={styles.floatingHandDrawerLabelText}>
            {title ?? (
              <Translate
                pt="Suas Cartas"
                en="Your Cards"
              />
            )}
            <span className={styles.floatingHandDrawerLabelTextHint}>
              (
              <Translate
                pt="Passe o mouse para expandir"
                en="Hover to expand"
              />
              )
            </span>
          </span>
        </span>
      </button>
      <Drawer
        title={
          <DivButton
            className={clsx(styles.floatingHandDrawerLabel, styles.floatingHandDrawerLabelOpen)}
            onClick={() => toggleDrawer(false)}
            onKeyDown={(e) => e.key === 'Enter' && toggleDrawer(false)}
          >
            <Icon
              icon={icon ?? <HandOfCardsIcon />}
              className={styles.floatingHandDrawerIcon}
              alt={translate({ pt: 'Mão de Cartas', en: 'Hand of Cards' })}
            />
            <span className={styles.floatingHandDrawerLabelText}>
              {title ?? (
                <Translate
                  pt="Suas Cartas"
                  en="Your Cards"
                />
              )}
              <span className={styles.floatingHandDrawerLabelTextHint}>
                (
                <Translate
                  pt="Clique aqui para fechar"
                  en="Click here to close"
                />
                )
              </span>
            </span>
          </DivButton>
        }
        placement="bottom"
        onClose={toggleDrawer}
        open={open}
        mask={false}
        size={Math.max(378, height)}
      >
        <div ref={ref}>{children}</div>
      </Drawer>
    </>
  );
}
