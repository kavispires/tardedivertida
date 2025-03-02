import clsx from 'clsx';
// Ant Design Resources
import { Alert } from 'antd';
// Components
import { ImageCard } from 'components/image-cards';
// Internal
import {
  type CalendarContent,
  CARD_CONTENT_TYPES,
  type EscapeRoomCardContentType,
  type ImageCardContent,
  type ImageCardSequenceContent,
  type SpriteContent,
  type SpriteSequenceContent,
  type SpriteGridContent,
  type TextBoxContent,
  type TitleContent,
} from './escape-room-types';
import { CenterBox, getBoxClasses, Sprite, TextBox, Title } from './CardBuildingBlocks';

export const ContentDelegator = ({
  content,
  width,
}: { content: EscapeRoomCardContentType; width: number }) => {
  switch (content.type) {
    case CARD_CONTENT_TYPES.AUDIO:
      return <Alert message="Audio not implemented" type="error" showIcon />;
    case CARD_CONTENT_TYPES.CALENDAR:
      return <Alert message="Calendar not implemented" type="error" showIcon />;
    case CARD_CONTENT_TYPES.CODEX:
      return <Alert message="Codex not implemented" type="error" showIcon />;
    case CARD_CONTENT_TYPES.DIGIT:
      return <Alert message="Digit not implemented" type="error" showIcon />;
    case CARD_CONTENT_TYPES.IMAGE_CARD:
      return <ImageCardContentComponent content={content} width={width} />;
    case CARD_CONTENT_TYPES.IMAGE_CARD_COVER:
      return <Alert message="Image Card Cover not implemented" type="error" showIcon />;
    case CARD_CONTENT_TYPES.IMAGE_CARD_SEQUENCE:
      return <ImageCardSequenceContentComponent content={content} width={width} />;
    case CARD_CONTENT_TYPES.LABEL:
      return <Alert message="Label not implemented" type="error" showIcon />;
    case CARD_CONTENT_TYPES.LETTER:
      return <Alert message="Letter not implemented" type="error" showIcon />;
    case CARD_CONTENT_TYPES.NUMBER:
      return <Alert message="Number not implemented" type="error" showIcon />;
    case CARD_CONTENT_TYPES.SPRITE:
      return <SpriteContentComponent content={content} width={width} />;
    case CARD_CONTENT_TYPES.SPRITE_GRID:
      return <SpriteGridContentComponent content={content} width={width} />;
    case CARD_CONTENT_TYPES.SPRITE_SEQUENCE:
      return <SpriteSequenceComponent content={content} width={width} />;
    case CARD_CONTENT_TYPES.SPRITE_SHUFFLE:
      return <Alert message="Sprite Shuffle not implemented" type="error" showIcon />;
    case CARD_CONTENT_TYPES.SPRITE_WHEEL:
      return <Alert message="Sprite Wheel not implemented" type="error" showIcon />;
    case CARD_CONTENT_TYPES.TEXT_BOX:
      return <TextBoxContentComponent content={content} width={width} />;
    case CARD_CONTENT_TYPES.TITLE:
      return <TitleContentComponent content={content} width={width} />;
    default:
      return <Alert message={`Content type ${content.type} not implemented`} type="error" showIcon />;
  }
};

type ContentComponentProps<T> = { width: number } & {
  content: T;
};

function TextBoxContentComponent({ content }: ContentComponentProps<TextBoxContent>) {
  const { text, ...props } = content;
  return <TextBox {...props}>{content.text}</TextBox>;
}

function TitleContentComponent({ content }: ContentComponentProps<TitleContent>) {
  const { text, ...props } = content;
  return <Title {...props}>{content.text}</Title>;
}

function SpriteContentComponent({ content, width }: ContentComponentProps<SpriteContent>) {
  const { scale = 1 } = content;
  return (
    <CenterBox>
      <Sprite {...content} width={(width / 5) * scale} />
    </CenterBox>
  );
}

function SpriteSequenceComponent({ content, width }: ContentComponentProps<SpriteSequenceContent>) {
  const { library, spriteIds } = content;

  return (
    <div className={clsx('er-flex')}>
      {spriteIds.map((spriteId, index) => (
        <Sprite key={`${spriteId}-${index}`} library={library} spriteId={spriteId} width={(width / 7) * 1} />
      ))}
    </div>
  );
}

function SpriteGridContentComponent({ content, width }: ContentComponentProps<SpriteGridContent>) {
  const { library, spriteIds, scale, rotate } = content;

  return (
    <div className={clsx('er-flex')}>
      {spriteIds.map((spriteId, index) =>
        spriteId ? (
          <Sprite
            key={`${spriteId}-${index}`}
            library={library}
            spriteId={spriteId}
            width={(width / 7) * 1}
          />
        ) : (
          <div key={`${spriteId}-${index}`} className="er-sprite-grid-placeholder" />
        ),
      )}
    </div>
  );
}

function ImageCardContentComponent({ content, width }: ContentComponentProps<ImageCardContent>) {
  const { cardId, align = 'center', scale = 1 } = content;
  return (
    <ImageCard
      id={cardId}
      cardWidth={(width / 6) * scale}
      className={clsx(getBoxClasses('text', { align }), 'er-image-card')}
    />
  );
}

function ImageCardSequenceContentComponent({
  content,
  width,
}: ContentComponentProps<ImageCardSequenceContent>) {
  const { cardIds, align = 'center', scale = 1 } = content;
  return (
    <div className={clsx('er-flex', getBoxClasses('box', { align }))}>
      {cardIds.map((cardId, index) => (
        <ImageCard
          key={`${cardId}-${index}`}
          id={cardId}
          cardWidth={(width / 8) * scale}
          className="er-image-card"
        />
      ))}
    </div>
  );
}

function CalendarContentComponent({ content }: ContentComponentProps<CalendarContent>) {
  return <Alert message="Calendar not implemented" type="error" showIcon />;
}
