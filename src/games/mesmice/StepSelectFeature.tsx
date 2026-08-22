import clsx from 'clsx';
import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Divider } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Icons
import { XIcon } from '@icons/XIcon';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { Icon } from '@components/general/Icon';
import { Popconfirm } from '@components/general/Popconfirm';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { mockFeatureSelection } from './utils/mock';
import type {
  ExtendedObjectFeatureCard,
  HistoryEntry,
  ObjectCardObj,
  SubmitFeaturePayload,
} from './utils/types';
import { ActivePlayerObjectClue } from './components/ActivePlayerObjectClue';
import { ScoreTrack } from './components/ScoreTrack';
import { GroupScore } from './components/GroupScore';
import { ObjectFeature } from './components/ObjectFeature';

type StepSelectFeatureProps = {
  user: GamePlayer;
  features: Dictionary<ExtendedObjectFeatureCard>;
  activePlayer: GamePlayer;
  isUserTheActivePlayer: boolean;
  item: ObjectCardObj;
  clue: string;
  history: HistoryEntry[];
  onEliminate: (payload: SubmitFeaturePayload) => void;
  groupScore: number;
} & Pick<StepProps, 'announcement'>;

export function StepSelectFeature({
  user,
  features,
  item,
  clue,
  activePlayer,
  isUserTheActivePlayer,
  onEliminate,
  history,
  groupScore,
}: StepSelectFeatureProps) {
  const { isLoading } = useLoading();
  const { language } = useLanguage();

  const listOfFeatures = useMemo(
    () => orderBy(Object.values(features), [`title.${language}`, 'level']),
    [features, language],
  );

  useMock(() => {
    if (!isUserTheActivePlayer) {
      onEliminate({
        featureId: mockFeatureSelection(listOfFeatures, history, activePlayer.target),
      });
    }
  });

  return (
    <Step fullWidth>
      <StepTitle wait={isUserTheActivePlayer}>
        <Translate
          pt="Qual característica menos combina os dois objetos?"
          en="Which feature least connects the two objects?"
        />
      </StepTitle>

      <GroupScore
        groupScore={groupScore}
        playerScore={user.score}
      />

      <ViewIf condition={isUserTheActivePlayer}>
        <RuleInstruction type="wait">
          <Translate
            pt="Seu objeto é o objeto da vez, aguarde enquanto os outros jogadores eliminam características.
            <br/>
            O objetivo é eliminar as características até que apenas a que tem mais a ver permaneça.
            <br/>
            A característica mais votada será eliminada."
            en="Your object is the object of the round, wait while the other players eliminate features.
            <br/>
            The goal is to eliminate the remaining features until only the one that has the most related remains.
            <br/>
            The most voted feature will be eliminated."
          />
        </RuleInstruction>
      </ViewIf>

      <ViewIf condition={!isUserTheActivePlayer}>
        <RuleInstruction type="action">
          <Translate
            pt="Das características abaixo, <strong>selecione</strong> a que menos combina com os dois objetos que {player} escolheu e que escreveu.
            <br/>
            O objetivo é eliminar as características até que apenas a que tem mais a ver permaneça.
            <br/>
            Discuta com os outros jogadores para chegar a um consenso, mas a decisão final é sua.
            <br/>
            A característica mais votada será eliminada."
            en="From the features below, <strong>select</strong> the one that least connects the two objects that {player} chose and wrote.
            <br/>
            The goal is to eliminate the remaining features until only the one that has the most related remains.
            <br/>
            Discuss with the other players to reach a consensus, but the final decision is yours.
            <br/>
            The most voted feature will be eliminated."
            values={{
              player: <PlayerAvatarName player={activePlayer} />,
            }}
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
            {listOfFeatures.map((feature) => (
              <Popconfirm
                key={feature.id}
                title={
                  <Translate
                    pt="Tem certeza que quer escolher essa característica?"
                    en="Are you sure you want to choose this feature?"
                  />
                }
                onConfirm={() => onEliminate({ featureId: feature.id })}
                disabled={feature.eliminated || isUserTheActivePlayer || isLoading}
                type="yes-no"
              >
                <TransparentButton
                  className="features-container__button"
                  disabled={feature.eliminated}
                >
                  <ObjectFeature
                    key={feature.id}
                    feature={feature}
                    highlight={isUserTheActivePlayer && feature.id === user.target}
                    className={clsx(feature.eliminated && 'features-container__eliminated-object')}
                  />
                  {feature.eliminated && (
                    <Icon
                      icon={<XIcon />}
                      size="large"
                      className="features-container__eliminated-x"
                    />
                  )}
                </TransparentButton>
              </Popconfirm>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      <ScoreTrack history={history} />
    </Step>
  );
}
