// Components
import { PopoverRule, Step, Title, Translate } from '../../components';
import { Pasture } from './Pasture';
import { GamePremiseRules } from './RulesBlobs';

type StepQuestionSelectionProps = {
  activePlayer: GamePlayer;
  currentQuestions: MQuestion[];
  onSubmitQuestion: GenericFunction;
  players: GamePlayers;
  roundType: number;
  pastureSize: number;
};

export function StepQuestionSelection({
  currentQuestions,
  onSubmitQuestion,
  players,
  roundType,
  activePlayer,
  pastureSize,
}: StepQuestionSelectionProps) {
  return (
    <Step fullWidth className="m-step">
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
