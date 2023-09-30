import { useMemo, useState } from 'react';
// Ant Design Resources
// Hooks
import { useLoading } from 'hooks/useLoading';
import { RocketFilled } from '@ant-design/icons';
// Utils
import { isDevEnv, pluralize } from 'utils/helpers';
// Components
import { Step } from 'components/steps';
import { Instruction, TextHighlight, Title } from 'components/text';
import { Translate } from 'components/language';
import { VIPOnlyContainer } from 'components/vip';
import { TimedButton } from 'components/buttons';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { EvaluationGroup } from './components/EvaluationGroup';

type StepEvaluateGroupProps = {
  players: GamePlayers;
  user: GamePlayer;
  answerGroups: GroupAnswerEvaluationEntry[];
  answerGroupIndex: number;
  onNextGroup: () => void;
  onSubmitRejections: (payload: SubmitRejectedAnswers) => void;
} & AnnouncementProps;

export function StepEvaluateGroup({
  players,
  user,
  announcement,
  answerGroups,
  answerGroupIndex,
  onNextGroup,
  onSubmitRejections,
}: StepEvaluateGroupProps) {
  const { isLoading } = useLoading();

  const answerGroup = answerGroups[answerGroupIndex];

  // How long to wait to enable the button to give type to players to evaluate
  const waitDuration = useMemo(() => {
    // Dev
    if (isDevEnv) return 2;
    // When only 2 or less answers left
    return Math.min(answerGroup.answers.length * 3, 12);
  }, [answerGroup.answers.length]);

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate
          pt={
            <>
              Avaliação{' '}
              <TextHighlight>
                {answerGroupIndex + 1} / {answerGroups.length}
              </TextHighlight>
            </>
          }
          en={
            <>
              Evaluation{' '}
              <TextHighlight>
                {answerGroupIndex + 1} / {answerGroups.length}
              </TextHighlight>
            </>
          }
        />
      </Title>
      <Instruction contained>
        <Translate
          pt={
            <>
              Se você acha que alguma não está certa dentro da categoria e letra, aperte o botãozinho para
              marcar como errado.
              <br />
              Todos que responderam ganham{' '}
              <PointsHighlight>
                {answerGroup.letter.level} {pluralize(answerGroup.letter.level, 'ponto')}
              </PointsHighlight>{' '}
              e o primeiro jogador que respondeu corretamente ganha{' '}
              <PointsHighlight type="positive">
                {answerGroup.topic.level} {pluralize(answerGroup.topic.level, 'ponto')}
              </PointsHighlight>
              adicionais.
            </>
          }
          en={
            <>
              If you think any of them is wrong, press the button.
              <br />
              Everyone who answered earns{' '}
              <PointsHighlight>
                {answerGroup.letter.level} {pluralize(answerGroup.letter.level, 'point')}
              </PointsHighlight>
              and the first player who answered correctly earns additional{' '}
              <PointsHighlight type="positive">
                {answerGroup.topic.level} {pluralize(answerGroup.topic.level, 'point')}
              </PointsHighlight>
              .
            </>
          }
        />
      </Instruction>

      <EvaluationGroup
        answerGroup={answerGroup}
        players={players}
        user={user}
        onSubmitRejections={onSubmitRejections}
        timer={answerGroupIndex === 0 ? 15 : waitDuration}
      />

      <VIPNextGroup
        key={answerGroupIndex}
        onNextGroup={onNextGroup}
        isLoading={isLoading}
        duration={answerGroupIndex === 0 ? 15 : waitDuration}
        players={players}
      />
    </Step>
  );
}

type VIPNextGroupProps = {
  onNextGroup: () => void;
  isLoading: boolean;
  duration: number;
  players: GamePlayers;
};

function VIPNextGroup({ onNextGroup, isLoading, duration, players }: VIPNextGroupProps) {
  const [disableButton, setDisableButton] = useState(true);

  const rejections = useMemo(() => Object.values(players).filter((p) => p.ready).length, [players]);

  return (
    <VIPOnlyContainer className="m-admin" direction="vertical" align="center">
      <span>
        <Translate pt="Rejeições" en="Rejections" />: <TextHighlight>{rejections}</TextHighlight>
      </span>
      <TimedButton
        onClick={onNextGroup}
        disabled={disableButton || isLoading}
        type="primary"
        duration={duration}
        icon={<RocketFilled />}
        onExpire={() => setDisableButton(false)}
      >
        <Translate pt="Confirmar e ir paro o próximo grupo" en="Confirm and go to next answer" />
      </TimedButton>
    </VIPOnlyContainer>
  );
}
