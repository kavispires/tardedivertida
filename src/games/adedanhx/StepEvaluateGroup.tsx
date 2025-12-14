import { useMemo, useState } from 'react';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Utils
import { isDevMocking, pluralize } from 'utils/helpers';
// Components
import { HostOnlyContainer, HostTimedButton } from 'components/host';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, TextHighlight, StepTitle } from 'components/text';
// Internal
import type { GroupAnswerEvaluationEntry, SubmitRejectedAnswers } from './utils/types';
import { EvaluationGroup } from './components/EvaluationGroup';

type StepEvaluateGroupProps = {
  players: GamePlayers;
  user: GamePlayer;
  answersGroups: GroupAnswerEvaluationEntry[];
  answersGroupIndex: number;
  onNextGroup: () => void;
  onSubmitRejections: (payload: SubmitRejectedAnswers) => void;
} & Pick<StepProps, 'announcement'>;

export function StepEvaluateGroup({
  players,
  user,
  announcement,
  answersGroups,
  answersGroupIndex,
  onNextGroup,
  onSubmitRejections,
}: StepEvaluateGroupProps) {
  const answersGroup = answersGroups[answersGroupIndex];

  // How long to wait to enable the button to give type to players to evaluate
  const waitDuration = useMemo(() => {
    // Dev
    if (isDevMocking) return 2;
    // When only 2 or less answers left
    return Math.min(answersGroup.answers.length * 3, 12);
  }, [answersGroup.answers.length]);

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate
          pt={
            <>
              Avaliação{' '}
              <TextHighlight>
                {answersGroupIndex + 1} / {answersGroups.length}
              </TextHighlight>
            </>
          }
          en={
            <>
              Evaluation{' '}
              <TextHighlight>
                {answersGroupIndex + 1} / {answersGroups.length}
              </TextHighlight>
            </>
          }
        />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Se você acha que alguma não está certa dentro da categoria e letra, aperte o botãozinho para
              marcar como errado.
              <br />
              Todos que responderam ganham{' '}
              <PointsHighlight>
                {answersGroup.letter.level} {pluralize(answersGroup.letter.level, 'ponto')}
              </PointsHighlight>{' '}
              e o primeiro jogador que respondeu corretamente ganha{' '}
              <PointsHighlight type="positive">
                {answersGroup.topic.level} {pluralize(answersGroup.topic.level, 'ponto')}
              </PointsHighlight>
              adicionais.
            </>
          }
          en={
            <>
              If you think any of the answers is wrong, <strong>hit</strong> the check mark switch and submit
              wrong answers.
              <br />
              Everyone who answered earns{' '}
              <PointsHighlight>
                {answersGroup.letter.level} {pluralize(answersGroup.letter.level, 'point')}
              </PointsHighlight>
              and the first player who answered correctly earns additional{' '}
              <PointsHighlight type="positive">
                {answersGroup.topic.level} {pluralize(answersGroup.topic.level, 'point')}
              </PointsHighlight>
              .
            </>
          }
        />
      </RuleInstruction>

      <EvaluationGroup
        answersGroup={answersGroup}
        players={players}
        user={user}
        onSubmitRejections={onSubmitRejections}
        timer={answersGroupIndex === 0 ? 15 : waitDuration}
      />

      <HostNextGroup
        key={answersGroupIndex}
        onNextGroup={onNextGroup}
        duration={answersGroupIndex === 0 ? 15 : waitDuration}
        players={players}
      />
    </Step>
  );
}

type HostNextGroupProps = {
  onNextGroup: () => void;
  duration: number;
  players: GamePlayers;
};

function HostNextGroup({ onNextGroup, duration, players }: HostNextGroupProps) {
  const [disableButton, setDisableButton] = useState(true);

  const rejections = useMemo(() => Object.values(players).filter((p) => p.ready).length, [players]);

  return (
    <HostOnlyContainer className="m-admin" orientation="vertical" align="center">
      <span>
        <Translate pt="Rejeições" en="Rejections" />: <TextHighlight>{rejections}</TextHighlight>
      </span>
      <HostTimedButton
        onClick={onNextGroup}
        disabled={disableButton}
        duration={duration}
        onExpire={() => setDisableButton(false)}
      >
        <Translate pt="Confirmar e ir paro o próximo grupo" en="Confirm and go to next answer" />
      </HostTimedButton>
    </HostOnlyContainer>
  );
}
