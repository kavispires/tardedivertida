// Types
import type { GameRound, GamePlayer, GamePlayers } from 'types/game';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { Step, type StepProps } from '@components/steps/Step';
// Internal
import type {
  AddAnswerPayload,
  AllowedList,
  Answer,
  AnswerGroupObject,
  NextAnswersPayload,
  Question,
} from './utils/types';
import { AdminAnswerControl } from './components/AdminAnswerControl';
import { AnswerGroup } from './components/AnswerGroup';
import { UserAnswers } from './components/UserAnswers';

type StepCompareProps = {
  currentQuestion: Question;
  answerGroup: AnswerGroupObject;
  players: GamePlayers;
  user: GamePlayer;
  allAnswers: Answer[];
  onAddAnswer: (payload: AddAnswerPayload) => void;
  onNextAnswer: (payload: NextAnswersPayload) => void;
  remainingGroupsCount: number;
  allowedList: AllowedList;
  setAllowedList: React.Dispatch<React.SetStateAction<AllowedList>>;
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
        <Translate
          pt="Pronto!"
          en="All done!"
        />

        <HostNextPhaseButton round={round} />
      </Step>
    );
  }

  return (
    <Step
      fullWidth
      announcement={announcement}
      hidePlayersBar
    >
      <AnswerGroup
        currentQuestion={currentQuestion}
        answerGroup={answerGroup}
        players={players}
        allowUserAnswer={allowUserAnswer}
        remainingGroupsCount={remainingGroupsCount}
      />

      <UserAnswers
        user={user}
        answerGroup={answerGroup}
        onAddAnswer={onAddAnswer}
      />

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
