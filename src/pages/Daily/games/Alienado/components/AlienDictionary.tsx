// Ant Design Resources
import { ArrowRightOutlined } from '@ant-design/icons';
import { Flex, Space, Typography } from 'antd';
// Components
import { DivButton } from 'components/buttons/DivButton';
import { SignCard } from 'components/cards/SignCard';
import { Translate } from 'components/language/Translate';
// Pages
import { DailyItem } from 'pages/Daily/components/DailyItem';
import { Region } from 'pages/Daily/components/Region';
// Internal
import type { DailyAlienadoEntry } from '../utils/types';

type AlienDictionaryProps = {
  attributes: DailyAlienadoEntry['attributes'];
  width: number;
};

export function AlienDictionary({ attributes, width }: AlienDictionaryProps) {
  return (
    <Region>
      <Typography.Text strong>
        <Translate
          pt="O alienígena entende que isso é aquilo:"
          en="The alien understands that this is that:"
        />
      </Typography.Text>

      <Space
        orientation="vertical"
        className="alien-attributes"
      >
        {attributes.map((attribute) => (
          <Flex
            className="alien-attributes__attribute"
            key={attribute.id}
            gap={8}
          >
            <SignCard
              signId={attribute.spriteId}
              width={width}
              className="alien-attributes__sign"
            />
            <ArrowRightOutlined />
            <Flex className="alien-attributes__items">
              {attribute.itemsIds.map((itemId) => (
                <DivButton key={itemId}>
                  <DailyItem
                    itemId={itemId}
                    width={width - 12}
                    className="alien-attributes__item"
                    padding={0}
                  />
                </DivButton>
              ))}
            </Flex>
          </Flex>
        ))}
      </Space>
    </Region>
  );
}
