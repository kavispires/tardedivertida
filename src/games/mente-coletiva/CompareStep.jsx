import PropTypes from 'prop-types';

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
  allowedList,
  setAllowedList,
}) {
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
  allAnswers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      isLocked: PropTypes.bool,
      playerId: PropTypes.string,
      answer: PropTypes.string,
    })
  ),
  allowedList: PropTypes.object,
  answerGroup: PropTypes.shape({
    answer: PropTypes.string,
    entries: PropTypes.any,
    parsedAnswer: PropTypes.string,
  }),
  currentQuestion: PropTypes.shape({
    id: PropTypes.string,
    number: PropTypes.number,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
  }),
  onAddAnswer: PropTypes.func,
  onNextAnswer: PropTypes.func,
  players: PropTypes.object,
  remainingGroupsCount: PropTypes.number,
  setAllowedList: PropTypes.func,
  user: PropTypes.shape({
    answers: PropTypes.any,
    id: PropTypes.any,
  }),
};
