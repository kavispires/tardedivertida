import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useWindowSize } from 'react-use';
// Ant Design Resources
import {
  CloseOutlined,
  EyeOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  WarningOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Space, Tooltip } from 'antd';
// Hooks
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Components
import { EmojiSprite } from 'components/cards/EmojiCard';
import { GlyphSprite } from 'components/cards/GlyphCard';
import { ItemSprite } from 'components/cards/ItemCard';
import { SignSprite } from 'components/cards/SignCard';
import { WarehouseGoodSprite } from 'components/cards/WarehouseGoodCard';
import { Translate } from 'components/language';
// Internal
import type { Align, BoxVariant, Size } from './escape-room-types';
// Images
import escapeRoomSprite from './escape-room-sprites.svg';
// Sass
import './cards.styles.scss';

type ModalOverlayProps = {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
};

/**
 * ModalOverlay component provides a modal with various transformation controls.
 * @param props.children - The content to be displayed inside the modal.
 * @param props.onClose - The function to call when the modal is closed.
 * @param props.open - A boolean indicating whether the modal is open or not.
 * @returns The rendered modal overlay component or null if not open.
 */
const ModalOverlay: React.FC<ModalOverlayProps> = ({ children, onClose, open }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  const zoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  const rotateLeft = () => setRotation((prevRotation) => prevRotation - 45);
  const rotateRight = () => setRotation((prevRotation) => prevRotation + 45);
  const toggleFlipX = () => setFlipX((prevFlipX) => !prevFlipX);
  const toggleFlipY = () => setFlipY((prevFlipY) => !prevFlipY);

  if (!open) return null;

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="simple-modal-overlay" onClick={handleOverlayClick}>
      <AnimatePresence>
        <motion.div
          className="simple-modal-overlay__content"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.1 }}
        >
          <Button
            shape="circle"
            size="large"
            ghost
            variant="outlined"
            className="simple-modal-overlay__close"
            onClick={onClose}
            icon={<CloseOutlined />}
          />
          <div
            className="simple-modal-overlay__body"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`,
            }}
          >
            {children}
          </div>
          <Space.Compact className="simple-modal-overlay__controls">
            <Button onClick={zoomIn} ghost icon={<ZoomInOutlined />} />

            <Button onClick={zoomOut} ghost icon={<ZoomOutOutlined />} />

            <Button onClick={rotateLeft} ghost icon={<RotateLeftOutlined />} />
            <Button onClick={rotateRight} ghost icon={<RotateRightOutlined />} />

            <Button onClick={toggleFlipX} ghost icon={<SwapOutlined />} />
            <Button onClick={toggleFlipY} ghost icon={<SwapOutlined style={{ rotate: '90deg' }} />} />
          </Space.Compact>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export function Markdown({ children, className = '' }: { children?: string; className?: string }) {
  return (
    <div className={clsx('er-markdown', className)}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}

type ERSpriteProps = {
  id: string;
  /**
   * In `em`
   */
  width?: number;
} & React.SVGProps<SVGSVGElement>;
export function ERSprite({ id, width, ...props }: ERSpriteProps) {
  return (
    <svg viewBox="0 0 512 512" width={`${width}em`} height={`${width}em`} {...props}>
      <use href={`${escapeRoomSprite}#${id}`}></use>
    </svg>
  );
}

const BACKGROUNDS: Record<string, string> = {
  default: 'er/backgrounds/default.jpg',
  defaultBlack: 'er/backgrounds/defaultBlack.jpg',
  abstractBlue: 'er/backgrounds/abstractBlue.jpg',
  digit: 'er/backgrounds/digit.jpg',
  messy: 'er/backgrounds/messy.jpg',
  metalDoor: 'er/backgrounds/metalDoor.jpg',
  shattered: 'er/backgrounds/shattered.jpg',
  space: 'er/backgrounds/space.jpg',
  zoomBlue: 'er/backgrounds/zoomBlue.jpg',
  zoomGrey: 'er/backgrounds/zoomGrey.jpg',
  zoomPink: 'er/backgrounds/zoomPink.jpg',
  zoomRed: 'er/backgrounds/zoomRed.jpg',
  zoomYellow: 'er/backgrounds/zoomYellow.jpg',
};

type CardProps = {
  cardId: string;
  width: number;
  background?: string;
  children: React.ReactNode;
  onPlayCard?: (cardId: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export function Card({
  children,
  width,
  background = 'default',
  style,
  onPlayCard,
  cardId,
  ...props
}: CardProps) {
  const [open, setOpen] = useState(false);
  const baseUrl = useTDBaseUrl('images');
  const backgroundImage = BACKGROUNDS?.[background] || '';
  const height = width * 1.5;
  const { height: windowHeight } = useWindowSize();

  const scale = (windowHeight * 0.85) / height;

  const Component = ({ s }: { s: number }) => (
    <div
      style={{
        fontSize: width / 20,
        width: width,
        height: 1.5 * width,
        backgroundImage: `url(${baseUrl}/${backgroundImage})`,
        padding: width / 20,
        transform: `scale(${s})`,
        ...style,
      }}
      className={clsx('er-card', `er-card--${background}`)}
      {...props}
    >
      {children}
    </div>
  );

  return (
    <div>
      <ModalOverlay open={open} onClose={() => setOpen(false)}>
        <Component s={scale} />
      </ModalOverlay>

      <div className="er-card-container">
        <Button.Group style={{ width: '100%' }} size="small">
          <Button onClick={() => setOpen(true)} block>
            <EyeOutlined />
          </Button>
          <Tooltip title={<Translate pt="Usar card" en="Play card" />}>
            <Popconfirm
              title={<Translate en="Do you want to play this card?" pt="Deseja usar esta carta?" />}
              onConfirm={() => onPlayCard?.(cardId)}
            >
              <Button className="er-card-play-button" disabled={!onPlayCard} block>
                <ERSprite id="play-card" width={1} />
              </Button>
            </Popconfirm>
          </Tooltip>
        </Button.Group>

        <Component s={1} />
      </div>
    </div>
  );
}

type SpriteProps = {
  library: string;
  spriteId: string;
  scale?: number;
  rotate?: number;
  width?: number;
  className?: string;
};
export function Sprite({ library, spriteId, scale = 1, rotate = 0, width = 10, className }: SpriteProps) {
  const style = { transform: `rotate(${rotate}deg) scale(${scale})` };

  switch (library) {
    case 'alien-signs':
      return <SignSprite id={spriteId} width={width} style={style} className={className} />;
    case 'emojis':
      return <EmojiSprite id={spriteId} width={width} style={style} className={className} />;
    case 'glyphs':
      return <GlyphSprite id={spriteId} width={width} style={style} className={className} />;
    case 'items':
      return <ItemSprite id={spriteId} width={width} style={style} className={className} />;
    case 'warehouse-goods':
      return <WarehouseGoodSprite id={spriteId} width={width} style={style} className={className} />;
    default:
      return <WarningOutlined style={{ color: 'red' }} />;
  }
}

type ImageCoverProps = {
  id: string;
  width: number;
} & ElementProps;
export function ImageCover({ id, width, children, className }: ImageCoverProps) {
  const baseUrl = useTDBaseUrl('images');
  const cardId = id.replace(/-/g, '/');
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${width * 1.5}px`,
        backgroundImage: `url(${baseUrl}/${cardId}.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

type BasicBlockProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

type HeaderProps = BasicBlockProps & {
  spriteId?: string;
};
export function Header({ children, spriteId }: HeaderProps) {
  return (
    <div className="er-card-header">
      {spriteId && <ERSprite id={spriteId} width={2} />}
      <h2>{children}</h2>
    </div>
  );
}

type ContentProps = BasicBlockProps & {
  center?: boolean;
};
export function Content({ children, center, ...props }: ContentProps) {
  return (
    <div className={clsx('er-card-content', center && 'er-card-content--center')} {...props}>
      {children}
    </div>
  );
}

export function CenterBox({ children, ...props }: BasicBlockProps) {
  return (
    <div className="er-center-box" {...props}>
      {children}
    </div>
  );
}

export function Empty({ size = 1, className, ...props }: ElementProps & { size?: number }) {
  return <div className={clsx('er-empty', `er-empty-${size}`, className)} {...props} />;
}

export function getBoxClasses(
  prefix: string,
  { size, align, variant }: { size?: Size; align?: Align; variant?: BoxVariant },
) {
  return clsx(
    size && `er-${prefix}--${size}`,
    align && `er-${prefix}--${align}`,
    variant && `er-${prefix}--${variant}`,
  );
}

type TextContentProps = BasicBlockProps & {
  size?: Size;
  align?: Align;
  variant?: BoxVariant;
};

export function Title({ children, size, align, variant, className, ...props }: TextContentProps) {
  return (
    <h3 className={clsx('er-title', getBoxClasses('box', { size, align, variant }), className)} {...props}>
      {children}
    </h3>
  );
}

export function Subtitle({ children, size, align, variant, className, ...props }: TextContentProps) {
  return (
    <h3 className={clsx('er-subtitle', getBoxClasses('box', { size, align, variant }), className)} {...props}>
      {children}
    </h3>
  );
}

export function Label({ children, size, align, variant, className, ...props }: TextContentProps) {
  return (
    <div className={clsx('er-label', getBoxClasses('box', { size, align, variant }), className)} {...props}>
      {children}
    </div>
  );
}

export function TextBox({
  children,
  size,
  align,
  variant,
  className,
  ...props
}: Omit<TextContentProps, 'children'> & { children?: string }) {
  if (!children) return null;
  return (
    <Markdown
      className={clsx('er-text-box', getBoxClasses('box', { size, align, variant }), className)}
      {...props}
    >
      {children}
    </Markdown>
  );
}
