// Ant Design Resources
import { Space } from 'antd';
// Types
import type { TextCard } from 'types/tdr';
// Components
import { Card } from 'components/cards';
import { EmojiCard } from 'components/cards/EmojiCard';
import { GlyphCard } from 'components/cards/GlyphCard';
import { WarehouseGoodCard } from 'components/cards/WarehouseGoodCard';
// Internal
import type { Captcha } from '../utils/types';

type CaptchaTopicProps = {
  captcha: Captcha;
};

export function CaptchaTopic({ captcha }: CaptchaTopicProps) {
  if (captcha.roundType === 'glyphs') {
    const values = captcha.values as number[];
    return (
      <Space>
        {values.map((glyph) => (
          <GlyphCard key={glyph} glyphId={String(glyph)} />
        ))}
      </Space>
    );
  }

  if (captcha.roundType === 'emojis') {
    const values = captcha.values as number;
    return <EmojiCard key={values} emojiId={String(values)} />;
  }

  if (captcha.roundType === 'warehouse-goods') {
    const values = captcha.values as string[];
    return (
      <Space>
        {values.map((id) => (
          <WarehouseGoodCard key={id} goodId={id} />
        ))}
      </Space>
    );
  }

  const values = captcha.values as TextCard;

  return <Card hideHeader>{values.text}</Card>;
}
