import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Button, Flex, Typography } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { ImageCard } from 'components/image-cards/ImageCard';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
// Internal
import type { GeneratedKid } from '../utils/types';

const { Text } = Typography;

type SolveModalProps = {
  kids: GeneratedKid[];
  onResolve: (kidId: string) => void;
  guesses: string[];
  assessments: Record<string, 'culprit' | 'liar' | 'innocent' | null>;
};

export function SolveModal({ kids, onResolve, guesses }: SolveModalProps) {
  const width = useCardWidth(4, { margin: 8, maxWidth: 192, minWidth: 64 });

  const sortedKids = useMemo(() => {
    return orderBy(
      kids.filter((kid) => !guesses.includes(kid.cardId)),
      ['name.pt', 'name.en'],
      ['asc', 'asc'],
    );
  }, [kids, guesses]);

  return (
    <Flex
      gap={12}
      wrap
      justify="center"
    >
      {sortedKids.map((kid) => (
        <Flex
          key={kid.id}
          vertical
          align="center"
          style={{ width: width + 12 }}
        >
          <ImageCard
            cardId={kid.cardId}
            cardWidth={width}
            preview={false}
          />
          <Text strong>
            <DualTranslate>{kid.name}</DualTranslate>
          </Text>
          <Button
            size="small"
            onClick={() => onResolve(kid.cardId)}
            shape="round"
          >
            <Translate
              pt="Selecionar"
              en="Select"
            />
          </Button>
        </Flex>
      ))}
    </Flex>
  );
}
