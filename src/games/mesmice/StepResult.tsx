import clsx from 'clsx';
import { orderBy } from 'lodash';
import { motion } from 'motion/react';
import { useMemo } from 'react';
// Ant Design Resources
import { Divider } from 'antd';
// Types
import type { GameRound, GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Utils
import { getAnimation } from '@utils/animations';
// Icons
import { XIcon } from '@icons/XIcon';
// Components
import { Icon } from '@components/general/Icon';
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import type { ExtendedObjectFeatureCard, HistoryEntry, MostVotesResult, ObjectCardObj } from './utils/types';
import { OUTCOME } from './utils/constants';
import { ObjectFeature } from './components/ObjectFeature';
import { ActivePlayerObjectClue } from './components/ActivePlayerObjectClue';
import { ScoreTrack } from './components/ScoreTrack';
import { Votes } from './components/Votes';
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
  const { language } = useLanguage();
  const listOfFeatures = useMemo(
    () => orderBy(Object.values(features), [`title.${language}`, 'level']),
    [features, language],
  );

  const roundScore = useMemo(
    () =>
      history.reduce((acc, entry) => {
        if (entry.pass) {
          return acc + entry.score;
        }
        return acc;
      }, 0),
    [history],
  );

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Resultado"
          en="Result"
        />
      </StepTitle>

      <GroupScore
        groupScore={groupScore}
        playerScore={user.score}
      />

      <ViewIf condition={outcome === OUTCOME.WIN}>
        <RuleInstruction type="scoring">
          <Translate
            pt={
              <>
                Parabéns!!! Vocês eliminaram todas as características!!!
                <br />
                Pontos da Rodada: {roundScore}
              </>
            }
            en={
              <>
                Congratulations!!! You eliminated all features!!!
                <br />
                Round's Score: {roundScore}
              </>
            }
          />
        </RuleInstruction>
      </ViewIf>

      <ViewIf condition={outcome === OUTCOME.CONTINUE}>
        <RuleInstruction type="scoring">
          <Translate
            pt="Vocês eliminaram uma característica correta!"
            en="The players have eliminated a correct feature!"
          />
        </RuleInstruction>
      </ViewIf>

      <ViewIf condition={outcome === OUTCOME.LOSE}>
        <RuleInstruction type="alert">
          <Translate
            pt={
              <>
                Oh não! Vocês eliminaram a característica-alvo!!!
                <br />
                Pontos da Rodada: {roundScore}
              </>
            }
            en={
              <>
                Oh no! You eliminated the target feature!!!
                <br />
                Round's Score: {roundScore}
              </>
            }
          />
        </RuleInstruction>
      </ViewIf>

      <div className="game-container">
        <div className="selections-container">
          <ActivePlayerObjectClue
            activePlayer={activePlayer}
            item={item}
            clue={clue}
          />
          <div
            className="features-container"
            style={{
              gridTemplateColumns: `repeat(${listOfFeatures.length / 2}, 1fr)`,
            }}
          >
            {listOfFeatures.map((feature, index) => (
              <motion.div
                className="features-container__button"
                {...getAnimation('bounceIn', { delay: index * 0.5 })}
                key={feature.id}
              >
                <ObjectFeature
                  feature={feature}
                  highlight={
                    feature.id === activePlayer.target &&
                    (isUserTheActivePlayer || outcome === OUTCOME.LOSE || outcome === OUTCOME.WIN)
                  }
                  className={clsx(feature.eliminated && 'features-container__eliminated-object')}
                />
                {feature.eliminated && (
                  <Icon
                    icon={<XIcon />}
                    size="large"
                    className="features-container__eliminated-x"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      <ScoreTrack history={history} />

      <HostNextPhaseButton
        round={round}
        autoTriggerTime={outcome === OUTCOME.CONTINUE ? 7 : 15}
        withWaitingTimeBar
      />

      <Votes
        votes={votes}
        features={features}
        players={players}
      />
    </Step>
  );
}
