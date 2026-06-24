// Ant Design Resources
import { Flex, Tooltip } from 'antd';
// Icons
import { BoxCheckMarkIcon } from '@icons/BoxCheckMarkIcon';
import { BoxEqualIcon } from '@icons/BoxEqualIcon';
import { BoxPlusIcon } from '@icons/BoxPlusIcon';
import { BoxXIcon } from '@icons/BoxXIcon';
// Components
import { SpeakButton } from '@components/audio/SpeakButton';
import { ItemCard } from '@components/cards/ItemCard';
import { TextCard } from '@components/cards/TextCard';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { TextHighlight } from '@components/text/TextHighlight';

type PortmanteauProps = {
  word: string;
  itemsIds: string[];
  names?: string[];
  correct?: boolean;
};

export function Portmanteau({ word, itemsIds, names, correct }: PortmanteauProps) {
  return (
    <Surface contained>
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
        <Icon
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
        <Icon
          icon={<BoxEqualIcon />}
          size="small"
        />
        <TextCard>{word}</TextCard>
        {correct && (
          <Icon
            icon={<BoxCheckMarkIcon />}
            size="small"
          />
        )}
        {correct === false && (
          <Icon
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
    </Surface>
  );
}
