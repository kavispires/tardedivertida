import clsx from 'clsx';
import { throttle as throttleFunc } from 'lodash';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
// Ant Design Resources
import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons';
import { Button, Typography, type ButtonProps } from 'antd';
// Components
import { DebugOnly } from 'components/debug';
import { Translate } from 'components/language';
// Internal
import { ImageBlurButtonContainer } from './ImageBlurButtonContainer';
// Sass
import styles from './ImageCardButton.module.scss';

type ImageCardButtonProps = {
  /**
   * The id of the image
   */
  cardId: string;
  /**
   * The content, usually a ImageCard component
   */
  children: ReactNode;
  /**
   * Optional custom class name for the container
   */
  className?: string;
  /**
   * The position of the button (default: top)
   */
  buttonPosition?: 'top' | 'bottom';
  /**
   * The button is over the image (default: false)
   */
  over?: boolean;
  /**
   * Button icon replacement
   */
  icon?: ReactNode;
  /**
   * The function to be called when the button is clicked
   */
  onClick?: (cardId: UID) => void;
  /**
   * Disables the button (default: false)
   */
  disabled?: boolean;
  /**
   * The text for the button
   */
  buttonText?: ReactNode;
  /**
   * The props for the button
   */
  buttonProps?: Omit<ButtonProps, 'onClick' | 'disabled'>;
  /**
   * Hides button
   */
  hideButton?: boolean;
  /**
   * Whether to enable throttling for the button click (use when the click performs an API call)
   */
  throttle?: boolean;
};

export function ImageCardButton({
  cardId,
  children,
  className = '',
  buttonPosition = 'top',
  over = false,
  icon,
  onClick,
  disabled = false,
  buttonText,
  buttonProps = {},
  hideButton = false,
  throttle = false,
}: ImageCardButtonProps) {
  const isTop = buttonPosition === 'top';

  const iconComponent = icon ?? (isTop ? <DownCircleOutlined /> : <UpCircleOutlined />);

  const { className: buttonClassName, ...restButtonProps } = buttonProps;

  const latest = useRef({ cardId, onClick });
  latest.current = { cardId, onClick };

  const throttled = useMemo(() => {
    if (!throttle) return null;

    // leading true + trailing false avoids the "double fire" at the end
    const fn = throttleFunc(() => latest.current.onClick?.(latest.current.cardId), 750, {
      leading: true,
      trailing: false,
    });

    return fn;
    // depend ONLY on `throttle` so we don't recreate across renders
  }, [throttle]);

  useEffect(() => {
    // cancel pending trailing calls on unmount
    return () => throttled?.cancel();
  }, [throttled]);

  const handleClick = throttle ? () => throttled?.() : () => onClick?.(cardId);

  const button =
    !hideButton && onClick ? (
      <Button
        shape="round"
        size="small"
        ghost={over}
        className={clsx(
          styles.button,
          over && styles.buttonOver,
          over && buttonPosition === 'top' && styles.buttonOverTop,
          over && buttonPosition === 'bottom' && styles.buttonOverBottom,
          buttonClassName,
        )}
        onClick={handleClick}
        disabled={disabled}
        {...restButtonProps}
      >
        {iconComponent}
        {buttonText ?? (
          <Translate
            pt="Selecionar"
            en="Select"
          />
        )}
        {iconComponent}
      </Button>
    ) : null;

  return (
    <div className={clsx(styles.imageCardButton, className)}>
      {isTop && button}
      <ImageBlurButtonContainer
        cardId={cardId}
        position={buttonPosition === 'bottom' ? 'top' : 'bottom'}
      >
        <DebugOnly>
          <Typography.Text code>{cardId}</Typography.Text>
        </DebugOnly>
        <div className={styles.container}>{children}</div>
      </ImageBlurButtonContainer>
      {!isTop && button}
    </div>
  );
}
