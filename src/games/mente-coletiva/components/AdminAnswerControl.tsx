import { useMemo, useState } from 'react';
// Ant Design Resources
import { Button } from 'antd';
import { PlusCircleFilled, RocketFilled } from '@ant-design/icons';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useDevFeatures } from 'hooks/useDevFeatures';
// Components
import { AdminOnlyContainer } from 'components/admin';
import { Translate } from 'components/language';
import { Avatar } from 'components/avatars';
import { TimedButton } from 'components/buttons';

type AdminAnswerControlProps = {
  allAnswers: MAnswer[];
  allowedList: AllowedList;
  answerGroup: AnswerGroup;
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

        const included = answerGroup.entries.map((a: MAnswer) => a.id);
        const playerIds = answerGroup.entries.map((a: MAnswer) => a.playerId);

        return !included.includes(answer.id) && !playerIds.includes(answer.playerId);
      }),
    [allAnswers, answerGroup]
  );

  // How long to wait to enable the button to avoid ignoring player's custom adds to the answer group
  const waitDuration = useMemo(() => {
    const answersCount = answerGroup.entries.length;
    // Dev
    if (isDevEnv) return 1;
    // When all players are in
    if (playerCount === answersCount) return 1;
    // When only 2 or less answers left
    if (answersCount < 3 && remainingGroupsCount < 3) return 5;
    // When only 1 answer in
    if (answersCount === 1) return 5;
    // Other cases
    return 7;
  }, [answerGroup.entries.length, isDevEnv, playerCount, remainingGroupsCount]);

  return (
    <AdminOnlyContainer className="m-admin" direction="vertical" align="center">
      <TimedButton
        onClick={() => onNextAnswer({ allowedList: Object.keys(allowedList) })}
        disabled={disableButton || isLoading}
        type="primary"
        danger
        duration={waitDuration}
        icon={<RocketFilled />}
        onExpire={() => setDisableButton(false)}
      >
        <Translate pt="Confirmar e ir para próxima resposta" en="Confirm and go to next answer" />
      </TimedButton>

      <ul className="m-admin__players-answers">
        {filteredAnswers.map((answer) => {
          return (
            <Button
              size="large"
              disabled={isLoading}
              className="m-admin__answer"
              icon={<PlusCircleFilled />}
              key={`admin-${answer.id}`}
              onClick={() => onAddAnswer({ answer: { ...answer } })}
            >
              <Avatar id={players[answer.playerId].avatarId} /> {answer.answer}
            </Button>
          );
        })}
      </ul>
    </AdminOnlyContainer>
  );
}
