// Ant Design Resources
import { Flex, Popover, Progress, Space } from 'antd';
// Icons
import { RatingIcon } from '@icons/RatingIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type { HouseHappiness } from '../utils/types';

type HappinessTrackerProps = {
  happiness: HouseHappiness;
};

export function HappinessTracker({ happiness }: HappinessTrackerProps) {
  const percentage = Math.ceil((happiness.total / happiness.goal) * 100);

  return (
    <Space.Compact>
      <Space.Addon>
        <Popover
          title={
            <Translate
              pt="Felicidade da Casa"
              en="House Happiness"
            />
          }
          content={
            <Flex style={{ maxWidth: 320 }}>
              <Translate
                en={
                  <>
                    Happiness Level indicates how the housemates are in harmony and respectful of each other's
                    choices. You can increase it when someone gets your clue correctly and when each player
                    gets the final item correctly. Reaching the happiness goal will lead to a successful game
                    ending! You have up to 4 rounds to reach it.
                    <br />
                    Goal: <TextHighlight>{happiness.goal}</TextHighlight> Current:{' '}
                    <TextHighlight>{happiness.total}</TextHighlight>
                  </>
                }
                pt={
                  <>
                    O Nível de Felicidade indica o quão harmoniosos e respeitosos os colegas de quarto estão
                    com as escolhas uns dos outros. Você pode aumentá-lo quando alguém acerta sua pista e
                    quando cada jogador acerta o item final. Alcançar a meta de felicidade levará a um final
                    de jogo bem-sucedido! Vocês têm até 4 rodadas para alcançá-la.
                    <br />
                    Meta: <TextHighlight>{happiness.goal}</TextHighlight> Atual:{' '}
                    <TextHighlight>{happiness.total}</TextHighlight>
                  </>
                }
              />
            </Flex>
          }
        >
          <Icon icon={<RatingIcon />} />
        </Popover>
      </Space.Addon>
      <Space.Addon style={{ width: 200 }}>
        <Progress
          percent={percentage}
          strokeColor="gold"
        />
      </Space.Addon>
    </Space.Compact>
  );
}
