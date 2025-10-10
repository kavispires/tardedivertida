import clsx from 'clsx';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
// Ant Design Resources
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Switch, Tooltip } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Utils
import { NOOP } from 'utils/constants';
import { getAnimationClass } from 'utils/helpers';
// Icons
import { NoIcon } from 'icons/NoIcon';
// Components
import { PlayerAvatarName, IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { TimedTimerBar } from 'components/timers';
// Internal
import type { GroupAnswerEvaluationEntry, SubmitRejectedAnswers } from '../utils/types';
import { ANSWERING_TIME } from '../utils/constants';
import { CategoryCell, LetterCell } from './Grid';

type EvaluationGroupProps = {
  players: GamePlayers;
  user: GamePlayer;
  answersGroup: GroupAnswerEvaluationEntry;
  onSubmitRejections: (payload: SubmitRejectedAnswers) => void;
  timer: number;
};

export function EvaluationGroup({
  answersGroup,
  players,
  user,
  onSubmitRejections,
  timer,
}: EvaluationGroupProps) {
  const { isLoading } = useLoading();
  const [groupId, setGroupId] = useState<string>('');
  const [rejections, setRejections] = useState<BooleanDictionary>({});

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (groupId !== answersGroup.id) {
      setRejections({});
      setGroupId(answersGroup.id);
    }
  }, [answersGroup.id]);

  const updateRejection = (answerId: string, isRejected: boolean) => {
    setRejections((prev) => {
      const copy = { ...prev };
      if (!isRejected && copy[answerId]) {
        delete copy[answerId];
      } else {
        copy[answerId] = isRejected;
      }
      return copy;
    });
  };

  return (
    <div>
      <div className="div-container evaluation-entry">
        <div className="div-container evaluation-entry__side">
          <span className={clsx(getAnimationClass('flipInY'))} key={answersGroup.topic.id}>
            <CategoryCell data={answersGroup.topic} updateAnswer={NOOP} />
          </span>
          <PlusOutlined />
          <span className={clsx(getAnimationClass('flipInY'))} key={answersGroup.letter.letters}>
            <LetterCell data={answersGroup.letter} updateAnswer={NOOP} />
          </span>
        </div>
        <div
          className={clsx('div-container evaluation-entry__side', getAnimationClass('fadeIn'))}
          key={answersGroup.id}
        >
          {answersGroup.answers.map((answer) => {
            return (
              <div className="evaluation-entry__player" key={answer.playerId}>
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
                    <IconAvatar icon={<NoIcon />} size="small" />
                  </Tooltip>
                ) : (
                  <Switch
                    checkedChildren={<IconAvatar icon={<NoIcon />} size="small" />}
                    unCheckedChildren={<CheckOutlined />}
                    onClick={(v) => updateRejection(answer.id, v)}
                    checked={rejections[answer.id] ? true : undefined}
                  />
                )}
              </div>
            );
          })}
          <SpaceContainer className="evaluation-entry__reject-button">
            <Button
              type="primary"
              shape="round"
              onClick={() => onSubmitRejections({ evaluations: rejections })}
              loading={isLoading}
              disabled={isEqual(rejections, user.evaluations)}
            >
              <Translate pt="Atualizar rejeições" en="Reject wrong answers" />
            </Button>
          </SpaceContainer>
        </div>
      </div>
      <SpaceContainer key={answersGroup.id}>
        <TimedTimerBar duration={timer} onExpire={NOOP} className="margin" />
      </SpaceContainer>
    </div>
  );
}
