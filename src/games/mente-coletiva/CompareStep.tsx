// Design Resources
import { Divider } from 'antd';
// Components
import { Step } from '../../components/shared';
import { AdminAnswerControl } from './AdminAnswerControl';
import { AnswerGroup } from './AnswerGroup';
import { UserAnswers } from './UserAnswers';

type CompareStepProps = {
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
}: CompareStepProps) {
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
