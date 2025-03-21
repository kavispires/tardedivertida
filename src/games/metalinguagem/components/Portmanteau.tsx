// Ant Design Resources
import { Flex } from 'antd';
// Icons
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxEqualIcon } from 'icons/BoxEqualIcon';
import { BoxPlusIcon } from 'icons/BoxPlusIcon';
import { BoxXIcon } from 'icons/BoxXIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Card } from 'components/cards';
import { ItemCard } from 'components/cards/ItemCard';
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
      <Flex gap={3} align="center">
        <Flex vertical align="center">
          <ItemCard id={itemsIds[0]} />
          {names && <TextHighlight className="center">{names[0]}</TextHighlight>}
        </Flex>
        <IconAvatar icon={<BoxPlusIcon />} size="small" />
        <Flex vertical align="center">
          <ItemCard id={itemsIds[1]} />
          {names && <TextHighlight className="center">{names[1]}</TextHighlight>}
        </Flex>
        <IconAvatar icon={<BoxEqualIcon />} size="small" />
        <Card hideHeader>{word}</Card>
        {correct && <IconAvatar icon={<BoxCheckMarkIcon />} size="small" />}
        {correct === false && <IconAvatar icon={<BoxXIcon />} size="small" />}
      </Flex>
    </Instruction>
  );
}
