import { useMemo } from 'react';
// Design Resources
import { Button } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
// Hooks
import { useLanguage, useLoading } from '../../hooks';
// Components
import { AdminButton, AdminOnlyContainer, Avatar } from '../../components';

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
  const { translate } = useLanguage();
  const [isLoading] = useLoading();

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
    <AdminOnlyContainer className="m-admin">
      <AdminButton
        action={() => onNextAnswer({ allowedList: Object.keys(allowedList) })}
        label={translate('Confirmar e ir para próxima resposta', 'Confirm and go to next answer')}
      />

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