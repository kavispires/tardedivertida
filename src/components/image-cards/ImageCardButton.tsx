import clsx from 'clsx';
import type { ReactNode } from 'react';
// Ant Design Resources
import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons';
import { Button, type ButtonProps } from 'antd';
// Components
import { DebugOnly } from 'components/debug';
import { Translate } from 'components/language';
// Internal
import { ImageBlurButtonContainer } from './ImageBlurButtonContainer';
// Sass
import './ImageCardButton.scss';
//  Components

type ImageCardButtonProps = {
  /**
   * The id of the image
   */
  id: string;
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
  onClick?: (...args: any) => void;
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
};

export function ImageCardButton({
  id,
  children,
  className = '',
  buttonPosition = 'top',
  over = false,
  icon,
  onClick,
  disabled = false,
  buttonText,
  buttonProps = {},
}: ImageCardButtonProps) {
  const isTop = buttonPosition === 'top';

  const iconComponent = icon ?? (isTop ? <DownCircleOutlined /> : <UpCircleOutlined />);

  const { className: buttonClassName, ...restButtonProps } = buttonProps;

  const button = onClick ? (
    <Button
      shape="round"
      size="small"
      ghost={over}
      className={clsx(
        'image-card-button__button',
        over && 'image-card-button__button--over',
        over && `image-card-button__button--over-${buttonPosition}`,
        buttonClassName,
      )}
      onClick={() => onClick(id)}
      disabled={disabled}
      {...restButtonProps}
    >
      {iconComponent}
      {buttonText ?? <Translate pt="Selecionar" en="Select" />}
      {iconComponent}
    </Button>
  ) : (
    <></>
  );

  return (
    <div className={clsx('image-card-button', className)}>
      <ImageBlurButtonContainer cardId={id} position={buttonPosition === 'bottom' ? 'top' : 'bottom'}>
        <DebugOnly>{id}</DebugOnly>
        <div className="image-card-button__container">
          {isTop && button}
          {children}
          {!isTop && button}
        </div>
      </ImageBlurButtonContainer>
    </div>
  );
}
