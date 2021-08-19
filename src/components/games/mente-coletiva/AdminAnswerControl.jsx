import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
// Hooks
import { useLanguage, useLoading } from '../../../hooks';
// Components
import { translate } from '../../shared';
import { Avatar } from '../../avatars';
import { AdminButton, AdminOnly } from '../../admin';

function AdminAnswerControl({ answerGroup, allAnswers, players, onNextAnswer, allowedList }) {
  const language = useLanguage();
  const [isLoading] = useLoading();

  const filteredAnswers = useMemo(
    () =>
      allAnswers.filter((answer) => {
        if (answer.isLocked) return false;

        const included = answerGroup.entries.map((a) => a.id);
        const playerIds = answerGroup.entries.map((a) => a.playerId);

        return !included.includes(answer.id) && !playerIds.includes(answer.playerId);
      }),
    [allAnswers, answerGroup]
  );

  return (
    <AdminOnly className="m-admin">
      <AdminButton
        action={() => onNextAnswer(Object.keys(allowedList))}
        label={translate('Confirmar e ir para próxima resposta', 'Confirm and go to next answer', language)}
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
            >
              <Avatar id={players[answer.playerId].avatarId} /> {answer.answer}
            </Button>
          );
        })}
      </ul>
    </AdminOnly>
  );
}

AdminAnswerControl.propTypes = {
  allAnswers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      isLocked: PropTypes.bool,
      playerId: PropTypes.string,
      answer: PropTypes.string,
    })
  ),
  allowedList: PropTypes.any,
  answerGroup: PropTypes.shape({
    entries: PropTypes.any,
  }),
  onNextAnswer: PropTypes.func,
  players: PropTypes.object,
};

export default AdminAnswerControl;
