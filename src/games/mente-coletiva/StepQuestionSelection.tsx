// Hooks
import { useMock } from 'hooks/useMock';
// Utils
import { mockSelectQuestion } from './utils/mock';
// Components
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Pasture } from './components/Pasture';
import { GamePremiseRules } from './components/RulesBlobs';

type StepQuestionSelectionProps = {
  activePlayer: GamePlayer;
  currentQuestions: MQuestion[];
  onSubmitQuestion: GenericFunction;
  players: GamePlayers;
  roundType: number;
  pastureSize: number;
} & AnnouncementProps;

export function StepQuestionSelection({
  announcement,
  currentQuestions,
  onSubmitQuestion,
  players,
  roundType,
  activePlayer,
  pastureSize,
}: StepQuestionSelectionProps) {
  // DEV: Mock answers
  useMock(() => {
    onSubmitQuestion({ questionId: mockSelectQuestion(currentQuestions) });
  });

  return (
    <Step fullWidth className="m-step" announcement={announcement}>
      <Title>
        <Translate pt="Selecione uma das perguntas" en="Select one of the questions" />
      </Title>

      <PopoverRule content={<GamePremiseRules activePlayer={activePlayer} />} />

      <ul className="m-questions contained">
        {currentQuestions.map((question) => (
          <li className="m-questions__item" key={question.id}>
            <button
              onClick={() => onSubmitQuestion({ questionId: question.id })}
              className="m-question m-question--button"
            >
              <span className="m-question__prefix">{question.prefix}</span>
              <span className="m-question__number">{question.number}</span>
              <span className="m-question__suffix">{question.suffix}</span>
            </button>
          </li>
        ))}
      </ul>

      <Pasture players={players} pastureSize={pastureSize} roundType={roundType} />
    </Step>
  );
}
