// Type
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
// Components
import { Step, StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import type { ExtendedObjectFeatureCard, HistoryEntry, ObjectCardObj } from './utils/types';
import { ObjectFeature } from './components/ObjectFeature';
import { Divider } from 'antd';
import { IconAvatar } from 'components/avatars';
import { ViewIf } from 'components/views';
import { ActivePlayerObjectClue } from './components/ActivePlayerObjectClue';
import { XIcon } from 'icons/XIcon';
import { ScoreTrack } from './components/ScoreTrack';
import clsx from 'clsx';
import { getAnimationClass } from 'utils/helpers';
import { Votes } from './components/Votes';
import { GameRound, MostVotesResult } from 'types/game';
import { HostNextPhaseButton } from 'components/host';

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
}: StepResultProps) {
  const listOfFeatures = Object.values(features);

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt="Resultado" en="Result" />
      </Title>

      <ViewIf condition={outcome === 'WIN'}>
        <RuleInstruction type="scoring">
          <Translate
            pt="Parabéns!!! Vocês eliminaram todas as características!!!"
            en="Congratulations!!! You eliminated all features!!!"
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
            pt="Oh não! Vocês eliminaram a característica-alvo!!!"
            en="Oh no! You eliminated the target feature!!!"
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
