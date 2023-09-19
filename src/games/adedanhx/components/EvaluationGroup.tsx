import clsx from 'clsx';
import { useEffect, useState } from 'react';
// Ant Design Resources
import { Button, Space, Switch, Tooltip } from 'antd';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Utils
import { NOOP } from 'utils/constants';
// Icons
import { NoIcon } from 'icons/NoIcon';
// Components
import { Translate } from 'components/language';
import { AvatarName, IconAvatar } from 'components/avatars';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { CategoryCell, LetterCell } from './Grid';
import { getAnimationClass } from 'utils/helpers';
import { TimedTimerBar } from 'components/timers';

type EvaluationGroupProps = {
  players: GamePlayers;
  user: GamePlayer;
  answerGroup: GroupAnswerEvaluationEntry;
  onSubmitRejections: (payload: SubmitRejectedAnswers) => void;
  timer: number;
};

export function EvaluationGroup({
  answerGroup,
  players,
  user,
  onSubmitRejections,
  timer,
}: EvaluationGroupProps) {
  const { isLoading } = useLoading();
  const [groupId, setGroupId] = useState<string>('');
  const [rejections, setRejections] = useState<BooleanDictionary>({});

  useEffect(() => {
    if (groupId !== answerGroup.id) {
      setRejections({});
      setGroupId(answerGroup.id);
    }
  }, [answerGroup.id]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <div className="space-container evaluation-entry">
        <div className="space-container evaluation-entry__side">
          <span className={clsx(getAnimationClass('flipInY'))} key={answerGroup.topic.id}>
            <CategoryCell data={answerGroup.topic} updateAnswer={NOOP} />
          </span>
          <PlusOutlined />
          <span className={clsx(getAnimationClass('flipInY'))} key={answerGroup.letter.letters}>
            <LetterCell data={answerGroup.letter} updateAnswer={NOOP} />
          </span>
        </div>
        <div
          className={clsx('space-container evaluation-entry__side', getAnimationClass('fadeIn'))}
          key={answerGroup.id}
        >
          {answerGroup.answers.map((answer, index) => {
            return (
              <div className="evaluation-entry__player" key={answer.playerId}>
                <TimeHighlight>{answer.timestamp}"</TimeHighlight>{' '}
                <AvatarName player={players[answer.playerId]} />{' '}
                <span
                  className={clsx(
                    'evaluation-entry__answer-text',
                    answer.autoRejected && 'evaluation-entry__answer-text--rejected'
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
          <Space className="space-container evaluation-entry__reject-button">
            <Button
              type="primary"
              shape="round"
              className="button"
              onClick={() => onSubmitRejections({ evaluations: Object.keys(rejections) })}
              loading={isLoading}
              disabled={Object.keys(rejections).length === 0 || user?.evaluations[answerGroup.id]}
            >
              <Translate pt="Enviar errors" en="Submit wrong answers" />
            </Button>
          </Space>
        </div>
      </div>
      <Space className="space-container">
        <TimedTimerBar duration={timer} onExpire={NOOP} className="margin" />
      </Space>
    </div>
  );
}
