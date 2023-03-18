// Ant Design Resources
import { Divider } from 'antd';
// Hook
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { Step } from 'components/steps';
import { AdminAnswerControl } from './components/AdminAnswerControl';
import { AnswerGroup } from './components/AnswerGroup';
import { UserAnswers } from './components/UserAnswers';
import { Translate } from 'components/language';
import { AdminNextPhaseButton } from 'components/admin';

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
} & AnnouncementProps;

export function StepCompare({
  announcement,
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
  useTemporarilyHidePlayersBar();
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
    return (
      <Step fullWidth>
        <Translate pt="Pronto!" en="All done!" />
        <Divider />
        <AdminNextPhaseButton>Next Phase</AdminNextPhaseButton>
      </Step>
    );
  }

  return (
    <Step fullWidth announcement={announcement}>
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
        remainingGroupsCount={remainingGroupsCount}
      />
    </Step>
  );
}
