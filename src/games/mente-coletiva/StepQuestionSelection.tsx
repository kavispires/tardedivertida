// Hooks
import { useMock } from 'hooks/useMock';
import { useLoading } from 'hooks/useLoading';
// Types
import type { Question } from './utils/types';
// Utils
import { mockSelectQuestion } from './utils/mock';
// Components
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Pasture } from './components/Pasture';
import { GamePremiseRules } from './components/RulesBlobs';
import { CustomQuestion } from './components/CustomQuestion';
import { TransparentButton } from 'components/buttons';
import { GroupQuestionCard } from 'components/cards/GroupQuestionCard';

type StepQuestionSelectionProps = {
  activePlayer: GamePlayer;
  currentQuestions: Question[];
  onSubmitQuestion: GenericFunction;
  onSubmitCustomQuestion: GenericFunction;
  players: GamePlayers;
  roundType: number;
  pastureSize: number;
  user: GamePlayer;
} & AnnouncementProps;

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
      <Title size="small">
        <Translate pt="Selecione uma das perguntas" en="Select one of the questions" />
      </Title>

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
