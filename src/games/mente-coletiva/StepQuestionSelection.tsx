// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { TransparentButton } from 'components/buttons';
import { GroupQuestionCard } from 'components/cards/GroupQuestionCard';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import type { Question, SubmitCustomQuestionPayload, SubmitQuestionPayload } from './utils/types';
import { mockSelectQuestion } from './utils/mock';
import { Pasture } from './components/Pasture';
import { GamePremiseRules } from './components/RulesBlobs';
import { CustomQuestion } from './components/CustomQuestion';

type StepQuestionSelectionProps = {
  activePlayer: GamePlayer;
  currentQuestions: Question[];
  onSubmitQuestion: (payload: SubmitQuestionPayload) => void;
  onSubmitCustomQuestion: (payload: SubmitCustomQuestionPayload) => void;
  players: GamePlayers;
  roundType: number;
  pastureSize: number;
  user: GamePlayer;
} & Pick<StepProps, 'announcement'>;

export function StepQuestionSelection({
  announcement,
  currentQuestions,
  onSubmitQuestion,
  onSubmitCustomQuestion,
  players,
  roundType,
  activePlayer,
  pastureSize,
  user,
}: StepQuestionSelectionProps) {
  const { isLoading } = useLoading();

  // DEV: Mock answers
  useMock(() => {
    onSubmitQuestion({ questionId: mockSelectQuestion(currentQuestions) });
  });

  return (
    <Step fullWidth className="m-step" announcement={announcement}>
      <StepTitle>
        <Translate pt="Selecione uma das perguntas" en="Select one of the questions" />
      </StepTitle>

      <PopoverRule content={<GamePremiseRules activePlayer={activePlayer} />} />

      <ul className="contained">
        {currentQuestions.map((question) => (
          <li className="m-question-selection-item" key={question.id}>
            <TransparentButton
              onClick={() => onSubmitQuestion({ questionId: question.id })}
              disabled={isLoading || user.ready}
            >
              <GroupQuestionCard question={question} />
            </TransparentButton>
          </li>
        ))}
      </ul>
      <CustomQuestion onSubmit={onSubmitCustomQuestion} userId={user.id} />

      <Pasture players={players} pastureSize={pastureSize} roundType={roundType} />
    </Step>
  );
}
