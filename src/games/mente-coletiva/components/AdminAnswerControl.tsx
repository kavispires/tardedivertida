import { useMemo, useState } from 'react';
// Ant Design Resources
import { Button } from 'antd';
import { PlusCircleFilled, RocketFilled } from '@ant-design/icons';
// Hooks
import { useLoading } from 'hooks';
import { AdminOnlyContainer } from 'components/admin';
import { Translate } from 'components/language';
import { Avatar } from 'components/avatars';
import { TimedButton } from 'components/buttons';
// Components

type AdminAnswerControlProps = {
  allAnswers: MAnswer[];
  allowedList: AllowedList;
  answerGroup: AnswerGroup;
  onAddAnswer: GenericFunction;
  onNextAnswer: GenericFunction;
  players: GamePlayers;
};

export function AdminAnswerControl({
  allAnswers,
  allowedList,
  answerGroup,
  onNextAnswer,
  onAddAnswer,
  players,
}: AdminAnswerControlProps) {
  const { isLoading } = useLoading();
  const [disableButton, setDisableButton] = useState(true);

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

  return (
    <AdminOnlyContainer className="m-admin" direction="vertical" align="center">
      <TimedButton
        onClick={() => onNextAnswer({ allowedList: Object.keys(allowedList) })}
        disabled={disableButton || isLoading}
        type="primary"
        danger
        duration={10}
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
