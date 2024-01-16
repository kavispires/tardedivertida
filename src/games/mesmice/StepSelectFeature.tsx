// Type
import type { GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Step, StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import type {
  ExtendedObjectFeatureCard,
  HistoryEntry,
  ObjectCardObj,
  SubmitFeaturePayload,
} from './utils/types';
import { ObjectFeature } from './components/ObjectFeature';
import { Divider, Popconfirm } from 'antd';
import { AvatarName, IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { ViewOr } from 'components/views';
import { ActivePlayerObjectClue } from './components/ActivePlayerObjectClue';
import { XIcon } from 'icons/XIcon';
import { ScoreTrack } from './components/ScoreTrack';
import clsx from 'clsx';
import { useMock } from 'hooks/useMock';
import { mockFeatureSelection } from './utils/mock';

type StepSelectFeatureProps = {
  user: GamePlayer;
  features: Dictionary<ExtendedObjectFeatureCard>;
  activePlayer: GamePlayer;
  isUserTheActivePlayer: boolean;
  item: ObjectCardObj;
  clue: string;
  history: HistoryEntry[];
  onEliminate: (payload: SubmitFeaturePayload) => void;
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
}: StepSelectFeatureProps) {
  const { isLoading } = useLoading();
  const listOfFeatures = Object.values(features);

  useMock(() => {
    if (!isUserTheActivePlayer) {
      onEliminate({ featureId: mockFeatureSelection(listOfFeatures, history, activePlayer.target) });
    }
  });

  return (
    <Step fullWidth>
      <Title>
        <Translate
          pt={<>Qual característica menos combina os dois objetos?</>}
          en={<>Which feature least connects the two objects?</>}
        />
      </Title>

      <ViewOr condition={isUserTheActivePlayer}>
        <RuleInstruction type="wait">
          <Translate
            pt={
              <>
                Seu objeto é o objeto da vez, aguarde enquanto os outros jogadores eliminam características.
                <br />
                O objetivo é eliminar as características até que apenas a que tem mais a ver permaneça.
                <br />A característica mais votada será eliminada.
              </>
            }
            en={
              <>
                Your object is the object of the round, wait while the other players eliminate features.
                <br />
                The goal is to eliminate the remaining features until only the one that has the most related
                remains.
                <br />
                The most voted feature will be eliminated.
              </>
            }
          />
        </RuleInstruction>
        <RuleInstruction type="action">
          <Translate
            pt={
              <>
                Das características abaixo, <strong>selecione</strong> a que menos combina com os dois objetos
                que <AvatarName player={activePlayer} /> escolheu e que escreveu.
                <br />
                O objetivo é eliminar as características até que apenas a que tem mais a ver permaneça.
                <br />
                Discuta com os outros jogadores para chegar a um consenso, mas a decisão final é sua.
                <br />A característica mais votada será eliminada.
              </>
            }
            en={
              <>
                From the features below, <strong>select</strong> the one that least connects the two objects
                that <AvatarName player={activePlayer} /> chose and wrote.
                <br />
                The goal is to eliminate the remaining features until only the one that has the most related
                remains.
                <br />
                Discuss with the other players to reach a consensus, but the final decision is yours.
                <br />
                The most voted feature will be eliminated.
              </>
            }
          />
        </RuleInstruction>
      </ViewOr>

      <div className="game-container">
        <div className="selections-container">
          <ActivePlayerObjectClue activePlayer={activePlayer} item={item} clue={clue} />
          <div
            className="features-container"
            style={{ gridTemplateColumns: `repeat(${listOfFeatures.length / 2}, 1fr)` }}
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
              >
                <TransparentButton className="features-container__button" disabled={feature.eliminated}>
                  <ObjectFeature
                    key={feature.id}
                    feature={feature}
                    highlight={isUserTheActivePlayer && feature.id === user.target}
                    className={clsx(feature.eliminated && 'features-container__eliminated-object')}
                  />
                  {feature.eliminated && (
                    <IconAvatar icon={<XIcon />} size="large" className="features-container__eliminated-x" />
                  )}
                </TransparentButton>
              </Popconfirm>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      <ScoreTrack history={history} features={features} />
    </Step>
  );
}
