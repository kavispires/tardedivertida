import PropTypes from 'prop-types';
import React, { useState } from 'react';
// Design Resources
import { Divider } from 'antd';
// Components
import { Step } from '../../components/shared';
import AdminAnswerControl from './AdminAnswerControl';
import AnswerGroup from './AnswerGroup';
import UserAnswers from './UserAnswers';

export function CompareStep({
  currentQuestion,
  answerGroup,
  players,
  user,
  allAnswers,
  onAddAnswer,
  onNextAnswer,
  remainingGroupsCount,
}) {
  const [allowedList, setAllowedList] = useState({});

  const allowUserAnswer = (isAllowed, answerId) => {
    const allowedListCopy = { ...allowedList };
    if (!isAllowed) {
      delete allowedListCopy?.[answerId];
      setAllowedList(allowedListCopy);
    } else {
      setAllowedList({ ...allowedListCopy, [answerId]: true });
    }
  };

  if (!answerGroup) {
    return <Step fullWidth>Pronto!</Step>;
  }

  return (
    <Step fullWidth>
      <AnswerGroup
        currentQuestion={currentQuestion}
        answerGroup={answerGroup}
        players={players}
        allowUserAnswer={allowUserAnswer}
        remainingGroupsCount={remainingGroupsCount}
      />
      <Divider />
      <UserAnswers user={user} answerGroup={answerGroup} onAddAnswer={onAddAnswer} />
      <Divider />
      <AdminAnswerControl
        answerGroup={answerGroup}
        allAnswers={allAnswers}
        players={players}
        onAddAnswer={onAddAnswer}
        onNextAnswer={onNextAnswer}
        allowedList={allowedList}
      />
    </Step>
  );
}

CompareStep.propTypes = {
  allAnswers: PropTypes.any,
  answerGroup: PropTypes.any,
  currentQuestion: PropTypes.any,
  onAddAnswer: PropTypes.any,
  onNextAnswer: PropTypes.any,
  players: PropTypes.any,
  user: PropTypes.any,
};
