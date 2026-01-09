// Ant Design Resources
import { Flex, Tooltip } from 'antd';
// Icons
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxEqualIcon } from 'icons/BoxEqualIcon';
import { BoxPlusIcon } from 'icons/BoxPlusIcon';
import { BoxXIcon } from 'icons/BoxXIcon';
// Components
import { SpeakButton } from 'components/audio/SpeakButton';
import { IconAvatar } from 'components/avatars';
import { Card } from 'components/cards';
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { Instruction, TextHighlight } from 'components/text';

type PortmanteauProps = {
  word: string;
  itemsIds: string[];
  names?: string[];
  correct?: boolean;
};

export function Portmanteau({ word, itemsIds, names, correct }: PortmanteauProps) {
  return (
    <Instruction contained>
      <Flex
        gap={3}
        align="center"
      >
        <Flex
          vertical
          align="center"
        >
          {!!itemsIds?.[0] && <ItemCard itemId={itemsIds[0]} />}
          {names && <TextHighlight className="center">{names[0]}</TextHighlight>}
        </Flex>
        <IconAvatar
          icon={<BoxPlusIcon />}
          size="small"
        />
        <Flex
          vertical
          align="center"
        >
          {!!itemsIds?.[1] && <ItemCard itemId={itemsIds[1]} />}
          {names && <TextHighlight className="center">{names[1]}</TextHighlight>}
        </Flex>
        <IconAvatar
          icon={<BoxEqualIcon />}
          size="small"
        />
        <Card hideHeader>{word}</Card>
        {correct && (
          <IconAvatar
            icon={<BoxCheckMarkIcon />}
            size="small"
          />
        )}
        {correct === false && (
          <IconAvatar
            icon={<BoxXIcon />}
            size="small"
          />
        )}
        <Tooltip
          title={
            <Translate
              pt="Pronunciar"
              en="Pronounce"
            />
          }
        >
          <SpeakButton text={{ pt: word, en: word }} />
        </Tooltip>
      </Flex>
    </Instruction>
  );
}
