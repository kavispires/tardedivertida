import clsx from 'clsx';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useLoading } from '@hooks/useLoading';
// Utils
import { NOOP } from '@utils/constants';
import { getAnimationClass } from '@utils/helpers';
// Icons
import { NoIcon } from '@icons/NoIcon';
// Components
import { IconAvatar } from '@components/avatars/IconAvatar';
import { TimedButton } from '@components/buttons/TimedButton';
import { TripleStateButton } from '@components/buttons/TripleStateButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { TimeHighlight } from '@components/metrics/TimeHighlight';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
// Internal
import type { GroupAnswerEvaluationEntry, SubmitEvaluationsPayload } from '../utils/types';
import { ANSWERING_TIME } from '../utils/constants';
import { CategoryCell, LetterCell } from './Grid';

type EvaluationGroupProps = {
  players: GamePlayers;
  user: GamePlayer;
  answersGroup: GroupAnswerEvaluationEntry;
  answersGroupIndex: number;
  onSubmitCurrentEvaluations: (payload: SubmitEvaluationsPayload) => void;
};

export function EvaluationGroup({
  answersGroup,
  players,
  user,
  onSubmitCurrentEvaluations,
  answersGroupIndex,
}: EvaluationGroupProps) {
  const { isLoading } = useLoading();
  const [evaluations, setEvaluations] = useState<Dictionary<boolean>>(
    answersGroup.answers.reduce((acc: Dictionary<boolean>, answer) => {
      if (answer.autoRejected) {
        acc[answer.id] = false;
      }
      return acc;
    }, {}),
  );

  const isAllAutoRejected = useMemo(() => {
    return answersGroup.answers.every((answer) => answer.autoRejected);
  }, [answersGroup]);

  const isSubmitted = useMemo(() => {
    return answersGroup.answers.every((answer) => user?.evaluations?.[answer.id] !== undefined);
  }, [answersGroup, user]);

  const handleEvaluationChange = (answerId: string, evaluation: boolean) => {
    // When changing an evaluation, it should auto-match any answer that has the same text value, to avoid players having to evaluate the same answer multiple times if they are the same
    setEvaluations((prev) => {
      const updatedEvaluations = { ...prev, [answerId]: evaluation };
      const answer = answersGroup.answers.find((ans) => ans.id === answerId);
      if (answer) {
        answersGroup.answers.forEach((ans) => {
          if (ans.id !== answerId && ans.answer === answer.answer) {
            updatedEvaluations[ans.id] = evaluation;
          }
        });
      }
      return updatedEvaluations;
    });
  };

  const handleOnExpire = () => {
    // Accept any unevaluated answer as true, to avoid blocking the game flow. This means that if the player didn't evaluate an answer before the time runs out, it will be considered correct.
    const finalEvaluations = answersGroup.answers.reduce((acc: Dictionary<boolean>, answer) => {
      acc[answer.id] = evaluations[answer.id] ?? true;
      return acc;
    }, {});

    onSubmitCurrentEvaluations({ evaluations: finalEvaluations });
  };

  return (
    <div className="div-container evaluation-entry">
      <div className="div-container evaluation-entry__side">
        <span
          className={clsx(getAnimationClass('flipInY'))}
          key={answersGroup.topic.id}
        >
          <CategoryCell
            data={answersGroup.topic}
            updateAnswer={NOOP}
          />
        </span>
        <PlusOutlined />
        <span
          className={clsx(getAnimationClass('flipInY'))}
          key={answersGroup.letter.letters}
        >
          <LetterCell
            data={answersGroup.letter}
            updateAnswer={NOOP}
          />
        </span>
      </div>
      <div
        className={clsx('div-container evaluation-entry__side', getAnimationClass('fadeIn'))}
        key={answersGroup.id}
      >
        {answersGroup.answers.map((answer) => {
          return (
            <div
              className="evaluation-entry__player"
              key={answer.playerId}
            >
              <TimeHighlight>{ANSWERING_TIME - answer.timestamp}"</TimeHighlight>{' '}
              <PlayerAvatarName player={players[answer.playerId]} />{' '}
              <span
                className={clsx(
                  'evaluation-entry__answer-text',
                  answer.autoRejected && 'evaluation-entry__answer-text--rejected',
                )}
              >
                <Tooltip title={answer.answer}>{answer.answer}</Tooltip>
              </span>
              {answer.autoRejected ? (
                <Tooltip
                  title={
                    <Translate
                      pt="Resposta rejeitada automaticamente por não condizer com a letra"
                      en="Auto rejected for not fit the letter"
                    />
                  }
                >
                  <IconAvatar
                    icon={<NoIcon />}
                    size="small"
                  />
                </Tooltip>
              ) : (
                <TripleStateButton
                  size="small"
                  value={evaluations[answer.id] ?? null}
                  onChange={(value) => handleEvaluationChange(answer.id, !!value)}
                  style={{ border: '1px solid #cccccc' }}
                  disabled={isSubmitted}
                  icons={{
                    true: (
                      <IconAvatar
                        icon={<CheckOutlined />}
                        size="small"
                      />
                    ),
                    false: (
                      <IconAvatar
                        icon={<NoIcon className={clsx({ grayscale: evaluations[answer.id] !== false })} />}
                        size="small"
                      />
                    ),
                  }}
                />
              )}
            </div>
          );
        })}
        <SpaceContainer className="evaluation-entry__reject-button">
          <TimedButton
            type="primary"
            shape="round"
            onClick={() => onSubmitCurrentEvaluations({ evaluations })}
            onExpire={() => (isSubmitted ? null : handleOnExpire())}
            loading={isLoading}
            disabled={isSubmitted || Object.keys(evaluations).length !== answersGroup.answers.length}
            duration={getExpirationTime(answersGroupIndex, isAllAutoRejected, answersGroup.answers.length)}
          >
            <Translate
              pt="Enviar avaliações"
              en="Reject wrong answers"
            />
          </TimedButton>
        </SpaceContainer>
      </div>
    </div>
  );
}

function getExpirationTime(answersGroupIndex: number, isAllAutoRejected: boolean, totalAnswers: number) {
  if (answersGroupIndex === 0) {
    return 35;
  }

  if (isAllAutoRejected) {
    return 7;
  }

  // Give more time if there are more answers to evaluate, to avoid rushing players in groups with many answers
  return [10, 10, 12, 18, 20, 22][totalAnswers] || 25;
}
