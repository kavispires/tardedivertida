// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
import type { Item } from 'types/tdr';
// Icons
import { SpeechBubbleAcceptedIcon, SpeechBubbleDeclinedIcon } from 'icons/collection';
// Components
import { IconAvatar, PlayerAvatarName } from 'components/avatars';
import { TimedButton } from 'components/buttons/TimedButton';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { TableEntry } from './utils/types';
import { CREATOR_SCORE_BONUS, CREATOR_SCORE_POINTS, OTHERS_SCORE_POINTS } from './utils/constants';
import { ThingCard } from './components/ThingCard';
import { PlayersHandsCounts } from './components/PlayersHandsCounts';
// Hooks

type StepResultsProps = {
  players: GamePlayers;
  user: GamePlayer;
  cardsDict: Dictionary<Item>;
  creator: GamePlayer;
  goToNextStep: () => void;
  table: TableEntry[];
  category: string;
  creatorBonus?: boolean;
  turnOrder: GameOrder;
} & Pick<StepProps, 'announcement'>;

export function StepResults({
  announcement,
  players,
  cardsDict,
  creator,
  goToNextStep,
  table,
  category,
  creatorBonus,
  turnOrder,
}: StepResultsProps) {
  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle wait>
        <Translate
          pt={<>Resultados: "{category}"</>}
          en={<>Results: "{category}"</>}
        />
      </StepTitle>

      <RuleInstruction type="wait">
        <Translate
          pt={
            <>
              • Cada coisa aceita do criador vale{' '}
              <PointsHighlight>{CREATOR_SCORE_POINTS} pontos</PointsHighlight>
              <br />• Se o criador tem duas coisas aceitas, ele ganha{' '}
              <PointsHighlight>{CREATOR_SCORE_BONUS} ponto bônus</PointsHighlight>
              <br />• Cada coisa aceita dos outros jogadores vale{' '}
              <PointsHighlight>{OTHERS_SCORE_POINTS} pontos</PointsHighlight>
              <br />• Se você tem coisas rejeitadas por 2 rodadas seguidas, você perde{' '}
              <PointsHighlight type="negative">-1 ponto</PointsHighlight>
            </>
          }
          en={
            <>
              • Each accepted thing from the creator is worth{' '}
              <PointsHighlight>{CREATOR_SCORE_POINTS} points</PointsHighlight>
              <br />• If the creator has two accepted things, they earn{' '}
              <PointsHighlight>{CREATOR_SCORE_BONUS} bonus point</PointsHighlight>
              <br />• Each accepted thing from other players is worth{' '}
              <PointsHighlight>{OTHERS_SCORE_POINTS} points</PointsHighlight>
              <br />• If you have things rejected for 2 consecutive rounds, you lose{' '}
              <PointsHighlight type="negative">-1 point</PointsHighlight>
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer
        contained
        wrap
      >
        {table.map(({ playerId, accepted, cardId }) => {
          const player = players[playerId];

          return (
            <Flex
              key={`${playerId}-${cardId}`}
              orientation="vertical"
              gap={8}
              align="center"
            >
              <IconAvatar
                size="large"
                icon={accepted ? <SpeechBubbleAcceptedIcon /> : <SpeechBubbleDeclinedIcon />}
              />
              <ThingCard
                itemId={cardId}
                name={cardsDict[cardId].name}
                width={100}
              />
              <PlayerAvatarName player={player} />
            </Flex>
          );
        })}
      </SpaceContainer>

      {creatorBonus && (
        <RuleInstruction type="event">
          <Translate
            pt={
              <>
                <strong>
                  O criador <PlayerAvatarName player={creator} /> ganhou o bônus!
                </strong>{' '}
                Ele(a) teve suas duas primeiras coisas aceitas nesta rodada.
              </>
            }
            en={
              <>
                <strong>
                  The creator <PlayerAvatarName player={creator} /> earned the bonus!
                </strong>{' '}
                They had their first two things accepted this round.
              </>
            }
          />
        </RuleInstruction>
      )}

      <PlayersHandsCounts
        players={players}
        turnOrder={turnOrder}
      />

      <SpaceContainer>
        <TimedButton
          duration={[10, 10, 10, 12, 15]?.[table.length] ?? 20}
          icon={<TrophyOutlined />}
          onExpire={goToNextStep}
          onClick={goToNextStep}
        >
          <Translate
            pt="Ver Ranking"
            en="See Ranking"
          />
        </TimedButton>
      </SpaceContainer>
    </Step>
  );
}
