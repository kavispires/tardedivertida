import clsx from 'clsx';
import { useMemo } from 'react';
// Ant Design Resources
import { Divider } from 'antd';
// Type
import type { GamePlayer, GamePlayers } from 'types/player';
import type { GameRound, MostVotesResult } from 'types/game';
import type { ExtendedObjectFeatureCard, HistoryEntry, ObjectCardObj } from './utils/types';
// Hooks
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { XIcon } from 'icons/XIcon';
// Components
import { Step, StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { IconAvatar } from 'components/avatars';
import { ViewIf } from 'components/views';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { ObjectFeature } from './components/ObjectFeature';
import { ActivePlayerObjectClue } from './components/ActivePlayerObjectClue';
import { ScoreTrack } from './components/ScoreTrack';
import { Votes } from './components/Votes';
import { HostNextPhaseButton } from 'components/host';
import { GroupScore } from './components/GroupScore';

type StepResultProps = {
  user: GamePlayer;
  players: GamePlayers;
  features: Dictionary<ExtendedObjectFeatureCard>;
  activePlayer: GamePlayer;
  isUserTheActivePlayer: boolean;
  item: ObjectCardObj;
  clue: string;
  history: HistoryEntry[];
  votes: MostVotesResult[];
  outcome: string;
  round: GameRound;
  groupScore: number;
} & Pick<StepProps, 'announcement'>;

export function StepResult({
  user,
  players,
  features,
  item,
  clue,
  activePlayer,
  isUserTheActivePlayer,
  history,
  outcome,
  votes,
  round,
  announcement,
  groupScore,
}: StepResultProps) {
  const listOfFeatures = Object.values(features);

  const roundScore = useMemo(
    () =>
      history.reduce((acc, entry) => {
        if (entry.pass) {
          acc += entry.score;
        }
        return acc;
      }, 0),
    [history]
  );

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt="Resultado" en="Result" />
      </Title>

      <GroupScore groupScore={groupScore} playerScore={user.score} />

      <ViewIf condition={outcome === 'WIN'}>
        <RuleInstruction type="scoring">
          <Translate
            pt={
              <>
                Parabéns!!! Vocês eliminaram todas as características!!!
                <br />
                Pontos da Rodada: <PointsHighlight>{roundScore}</PointsHighlight>
              </>
            }
            en={
              <>
                Congratulations!!! You eliminated all features!!!
                <br />
                Round's Score: <PointsHighlight>{roundScore}</PointsHighlight>
              </>
            }
          />
        </RuleInstruction>
      </ViewIf>

      <ViewIf condition={outcome === 'CONTINUE'}>
        <RuleInstruction type="scoring">
          <Translate
            pt="Vocês eliminaram uma característica correta!"
            en="The players have eliminated a correct feature!"
          />
        </RuleInstruction>
      </ViewIf>

      <ViewIf condition={outcome === 'LOSE'}>
        <RuleInstruction type="alert">
          <Translate
            pt={
              <>
                Oh não! Vocês eliminaram a característica-alvo!!!
                <br />
                Pontos da Rodada: <PointsHighlight>{roundScore}</PointsHighlight>
              </>
            }
            en={
              <>
                Oh no! You eliminated the target feature!!!
                <br />
                Round's Score: <PointsHighlight>{roundScore}</PointsHighlight>
              </>
            }
          />
        </RuleInstruction>
      </ViewIf>

      <div className="game-container">
        <div className="selections-container">
          <ActivePlayerObjectClue activePlayer={activePlayer} item={item} clue={clue} />
          <div
            className="features-container"
            style={{ gridTemplateColumns: `repeat(${listOfFeatures.length / 2}, 1fr)` }}
          >
            {listOfFeatures.map((feature, index) => (
              <div
                className={clsx(
                  'features-container__button',
                  getAnimationClass('bounceIn', { delay: index })
                )}
                key={feature.id}
              >
                <ObjectFeature
                  feature={feature}
                  highlight={
                    feature.id === user.target &&
                    (isUserTheActivePlayer || outcome === 'LOSE' || outcome === 'WIN')
                  }
                  className={clsx(feature.eliminated && 'features-container__eliminated-object')}
                />
                {feature.eliminated && (
                  <IconAvatar icon={<XIcon />} size="large" className="features-container__eliminated-x" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      <ScoreTrack history={history} features={features} />

      <Divider />

      <Votes votes={votes} features={features} players={players} />

      <HostNextPhaseButton round={round} autoTriggerTime={13} />
    </Step>
  );
}
