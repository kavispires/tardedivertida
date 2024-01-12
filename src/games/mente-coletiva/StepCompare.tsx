// Ant Design Resources
import { Divider } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
import type { GameRound } from 'types/game';
import type { AllowedList, Answer, AnswerGroupObject, Question } from './utils/types';
// Hook
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { Step, type StepProps } from 'components/steps';
import { AdminAnswerControl } from './components/AdminAnswerControl';
import { AnswerGroup } from './components/AnswerGroup';
import { UserAnswers } from './components/UserAnswers';
import { Translate } from 'components/language';
import { HostNextPhaseButton } from 'components/host';

type StepCompareProps = {
  currentQuestion: Question;
  answerGroup: AnswerGroupObject;
  players: GamePlayers;
  user: GamePlayer;
  allAnswers: Answer[];
  onAddAnswer: GenericFunction;
  onNextAnswer: GenericFunction;
  remainingGroupsCount: number;
  allowedList: AllowedList;
  setAllowedList: GenericFunction;
  round: GameRound;
} & Pick<StepProps, 'announcement'>;

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
  round,
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
        <HostNextPhaseButton round={round} />
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
