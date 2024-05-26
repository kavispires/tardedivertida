import { Card, CardProps, Space, Typography } from 'antd';
import { SpeakButton } from 'components/audio/Speak';
import { ItemCard as Item } from 'components/cards/ItemCard';
import { DualTranslate, Translate } from 'components/language';
import { TextHighlight } from 'components/text';

import {
  ERItemCard,
  ERMissionCard,
  ERTextCard,
  ERUnorderedListCard,
  ERVoiceCard,
  EscapeRoomCard,
} from './utils/types';

type CardChromeProps = {
  card: EscapeRoomCard;
} & CardProps;

function CardChrome({ card, children, ...props }: CardChromeProps) {
  return (
    <Card
      title={<DualTranslate>{card.header.title}</DualTranslate>}
      className="escape-room-card"
      classNames={{ body: 'escape-room-card__body' }}
      actions={['Expand', 'Play']}
      hoverable
      extra={
        card.header.iconId && (
          <Item id={card.header.iconId} width={36} padding={4} className="escape-room-card__icon" />
        )
      }
      {...props}
    >
      {children}
    </Card>
  );
}

type MissionCardProps = {
  card: ERMissionCard;
};

export const MissionCard = ({ card }: MissionCardProps) => {
  return (
    <CardChrome card={card}>
      <Typography.Title level={4}>
        <DualTranslate>{card.content.title}</DualTranslate>
      </Typography.Title>
      {card.content.paragraphs?.map((paragraph, index) => (
        <Typography.Paragraph key={index}>
          <DualTranslate>{paragraph}</DualTranslate>
        </Typography.Paragraph>
      ))}

      {card.conditions?.map((condition) => (
        <Typography.Paragraph key={condition.requiredKeyword} type="secondary">
          <Translate pt="Se" en="If" />{' '}
          <TextHighlight negative>
            <DualTranslate>{condition.target}</DualTranslate>
          </TextHighlight>
          , <Translate pt="então" en="then" /> : <DualTranslate>{condition.consequence}</DualTranslate>
        </Typography.Paragraph>
      ))}
    </CardChrome>
  );
};

type ItemCardProps = {
  card: ERItemCard;
};

export const ItemCard = ({ card }: ItemCardProps) => {
  return (
    <CardChrome card={card}>
      <Item id={card.content.itemId} width={75} />
      {card.content.caption && (
        <Typography.Paragraph code>
          <DualTranslate>{card.content.caption}</DualTranslate>
        </Typography.Paragraph>
      )}
      {card.content.message && (
        <Typography.Paragraph>
          {card.content.message.iconId && <Item id={card.content.message.iconId} width={24} />}
          <DualTranslate>{card.content.message.text}</DualTranslate>
        </Typography.Paragraph>
      )}
    </CardChrome>
  );
};

type VoiceCardProps = {
  card: ERVoiceCard;
};

export const VoiceCard = ({ card }: VoiceCardProps) => {
  return (
    <CardChrome card={card}>
      <Space>
        <span>
          <Typography.Paragraph className="center">
            <SpeakButton text={card.content.speech} />
          </Typography.Paragraph>
        </span>
        {card.content.speech && (
          <Typography.Paragraph>
            {card.content.speaker && (
              <>
                <DualTranslate>{card.content.speaker}</DualTranslate>:<br />
              </>
            )}
            "<DualTranslate>{card.content.speech}</DualTranslate>"
          </Typography.Paragraph>
        )}
      </Space>
      {card.content.text && (
        <Typography.Paragraph code>
          <DualTranslate>{card.content.text}</DualTranslate>
        </Typography.Paragraph>
      )}
    </CardChrome>
  );
};

type TextCardProps = {
  card: ERTextCard;
};

export const TextCard = ({ card }: TextCardProps) => {
  return (
    <CardChrome card={card}>
      {card.content.text && (
        <Typography.Paragraph>
          <DualTranslate>{card.content.text}</DualTranslate>
        </Typography.Paragraph>
      )}
    </CardChrome>
  );
};

type UnorderedListCardProps = {
  card: ERUnorderedListCard;
};

export const UnorderedListCard = ({ card }: UnorderedListCardProps) => {
  return (
    <CardChrome card={card}>
      {card.content.title && (
        <Typography.Title level={4}>
          <DualTranslate>{card.content.title}</DualTranslate>
        </Typography.Title>
      )}
      <ul className="escape-room-card__list">
        {card.content.list.map((item, index) => (
          <li key={index}>
            <DualTranslate>{item}</DualTranslate>
          </li>
        ))}
      </ul>
    </CardChrome>
  );
};

type CardDelegatorProps = {
  card: EscapeRoomCard;
};

export const CardDelegator = ({ card }: CardDelegatorProps) => {
  switch (card.type) {
    case 'mission':
      return <MissionCard card={card} />;
    case 'item':
      return <ItemCard card={card} />;
    case 'voice':
      return <VoiceCard card={card} />;
    case 'text':
      return <TextCard card={card} />;
    case 'unordered-list':
      return <UnorderedListCard card={card} />;
    default:
      return null;
  }
};
