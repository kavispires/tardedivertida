import { useMemo, useState } from 'react';
// Ant Design Resources
import { PlusCircleFilled, RocketFilled } from '@ant-design/icons';
import { Button, Space } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useDevFeatures } from 'hooks/useDevFeatures';
import { useLoading } from 'hooks/useLoading';
// Components
import { Avatar } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { HostOnlyContainer } from 'components/host';
import { Translate } from 'components/language';
// Internal
import type { AllowedList, Answer, AnswerGroupObject } from '../utils/types';

type AdminAnswerControlProps = {
  allAnswers: Answer[];
  allowedList: AllowedList;
  answerGroup: AnswerGroupObject;
  onAddAnswer: GenericFunction;
  onNextAnswer: GenericFunction;
  players: GamePlayers;
  remainingGroupsCount: number;
};

export function AdminAnswerControl({
  allAnswers,
  allowedList,
  answerGroup,
  onNextAnswer,
  onAddAnswer,
  players,
  remainingGroupsCount,
}: AdminAnswerControlProps) {
  const { isLoading } = useLoading();
  const { isDevEnv } = useDevFeatures();
  const [disableButton, setDisableButton] = useState(true);
  const playerCount = Object.keys(players).length;

  const filteredAnswers = useMemo(
    () =>
      allAnswers.filter((answer) => {
        if (answer.isLocked) return false;

        const included = answerGroup.entries.map((a: Answer) => a.id);
        const playerIds = answerGroup.entries.map((a: Answer) => a.playerId);

        return !included.includes(answer.id) && !playerIds.includes(answer.playerId);
      }),
    [allAnswers, answerGroup],
  );

  // How long to wait to enable the button to avoid ignoring player's custom adds to the answer group
  const waitDuration = useMemo(() => {
    const answersCount = answerGroup.entries.length;
    // Dev
    if (isDevEnv) return 1;
    // When all players are in
    if (playerCount === answersCount) return 1;
    // When only 2 or less answers left
    if (answersCount < 3 && remainingGroupsCount < 3) return 3;
    // When only 1 answer in
    if (answersCount === 1) return 2;
    // Other cases
    return 5;
  }, [answerGroup.entries.length, isDevEnv, playerCount, remainingGroupsCount]);

  return (
    <HostOnlyContainer className="m-admin" direction="vertical" align="center">
      <TimedButton
        onClick={() => onNextAnswer({ allowedList: Object.keys(allowedList) })}
        disabled={disableButton || isLoading}
        type="primary"
        duration={waitDuration}
        icon={<RocketFilled />}
        onExpire={() => setDisableButton(false)}
      >
        <Translate pt="Confirmar e ir para próxima resposta" en="Confirm and go to next answer" />
      </TimedButton>

      {filteredAnswers.length > 0 && (
        <p>
          <Translate
            pt="Essas são as respostas dos jogadores que não deram match com a atual resposta. Somente adicione elas se os jogadores estiverem comendo mosca"
            en="These are the players who haven't matched the current answer. Only add them if a player failed to do so for themselves."
          />
        </p>
      )}
      <Space className="space-container" wrap align="center">
        {filteredAnswers.map((answer) => {
          return (
            <Button
              size="large"
              disabled={isLoading}
              className="m-admin__answer"
              icon={<PlusCircleFilled />}
              loading={isLoading}
              key={`admin-${answer.id}`}
              onClick={() => onAddAnswer({ answer: { ...answer } })}
            >
              <Avatar id={players[answer.playerId].avatarId} /> {answer.answer}
            </Button>
          );
        })}
      </Space>
    </HostOnlyContainer>
  );
}
