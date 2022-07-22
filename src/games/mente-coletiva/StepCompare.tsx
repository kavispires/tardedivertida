// Ant Design Resources
import { Divider } from 'antd';
// Components
import { Step } from 'components/steps';
import { AdminAnswerControl } from './components/AdminAnswerControl';
import { AnswerGroup } from './components/AnswerGroup';
import { UserAnswers } from './components/UserAnswers';

type StepCompareProps = {
  currentQuestion: MQuestion;
  answerGroup: AnswerGroup;
  players: GamePlayers;
  user: GamePlayer;
  allAnswers: MAnswer[];
  onAddAnswer: GenericFunction;
  onNextAnswer: GenericFunction;
  remainingGroupsCount: number;
  allowedList: AllowedList;
  setAllowedList: GenericFunction;
};

export function StepCompare({
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
}: StepCompareProps) {
  const allowUserAnswer = (isAllowed: boolean, answerId: string) => {
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
        key={answerGroup.answer}
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
