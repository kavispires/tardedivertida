import { orderBy } from 'lodash';
// Ant Design Resources
import { Flex, Popover, Typography } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { ImageCard } from 'components/image-cards/ImageCard';
import { Translate } from 'components/language';
// Internal
import type { DataCounts, TimeBombCard } from '../utils/types';
import { CARD_IMAGE_NAMES } from '../utils/constants';
import { BlankHighlight, BombHighlight, RedWireHighlight } from './Highlights';

type HandProps = {
  hand: TimeBombCard[];
  dataCounts: DataCounts;
};

export function Hand({ hand, dataCounts }: HandProps) {
  const cardWidth = useCardWidth(5, {
    minWidth: 100,
    maxWidth: 150,
    gap: 16,
  });
  return (
    <Flex className="my-4">
      {orderBy(hand, ['type'], ['desc']).map((card: TimeBombCard) => (
        <Flex
          key={card.id}
          vertical
        >
          <ImageCard
            cardWidth={cardWidth}
            cardId={CARD_IMAGE_NAMES[card.type]}
          />
          <CardDescription
            type={card.type}
            dataCounts={dataCounts}
          />
        </Flex>
      ))}
    </Flex>
  );
}

type CardDescriptionProps = {
  type: TimeBombCard['type'];
  dataCounts: DataCounts;
};

export function CardDescription({ type, dataCounts }: CardDescriptionProps) {
  if (type === 'bomb') {
    return (
      <Flex
        align="center"
        justify="center"
      >
        <Popover
          title={
            <Translate
              pt="Essa é a bomba"
              en="This is the bomb"
            />
          }
          content={
            <Typography.Paragraph style={{ maxWidth: 300 }}>
              <Translate
                pt={<>Caso seja revelada, o jogo acaba imediatamente e os terroristas vencem.</>}
                en={<>If revealed, the game ends immediately and the terrorists win.</>}
              />
            </Typography.Paragraph>
          }
        >
          <span>
            <BombHighlight>
              <Translate
                pt="Bomba"
                en="Bomb"
              />
            </BombHighlight>
          </span>
        </Popover>
      </Flex>
    );
  }

  if (type === 'wire') {
    return (
      <Flex
        align="center"
        justify="center"
      >
        <Popover
          title={
            <Translate
              pt="Esse é o fio vermelho"
              en="This is the red wire"
            />
          }
          content={
            <Typography.Paragraph style={{ maxWidth: 300 }}>
              <Translate
                pt={
                  <>
                    Os agentes devem achar {dataCounts.wires} desses no total. Por enquanto acharam {0}.
                  </>
                }
                en={
                  <>
                    Agents must find {dataCounts.wires} of these in total. So far they have found {0}.
                  </>
                }
              />
            </Typography.Paragraph>
          }
        >
          <span>
            <RedWireHighlight>
              <Translate
                pt="Fio"
                en="Wire"
              />
            </RedWireHighlight>
          </span>
        </Popover>
      </Flex>
    );
  }

  return (
    <Flex
      align="center"
      justify="center"
    >
      <Popover
        title={
          <Translate
            pt="Essa carta não é nada"
            en="This is the nothing"
          />
        }
        content={
          <Typography.Paragraph style={{ maxWidth: 300 }}>
            <Translate
              pt={
                <>
                  Caso seja revelada, é apenas uma perda de tempo, pelo menos você será o próximo
                  investigador.
                </>
              }
              en={<>If revealed, it is just a waste of time, at least you will be the next investigator.</>}
            />
          </Typography.Paragraph>
        }
      >
        <span>
          <BlankHighlight>
            <Translate
              pt="Nada"
              en="Blank"
            />
          </BlankHighlight>
        </span>
      </Popover>
    </Flex>
  );
}
