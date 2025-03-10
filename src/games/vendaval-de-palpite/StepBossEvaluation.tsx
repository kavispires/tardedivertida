// Types
import type { GameRound } from 'types/game';
import type { GamePlayers } from 'types/player';
// Components
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import type { Clues, BoardObject } from './utils/types';
import { Board } from './components/Board';
import { CategoryWordGroup } from './components/CategoryWordGroup';
import { OutcomeOptions } from './components/OutcomeOptions';
import { ClueEvaluation } from './components/ClueEvaluation';

type StepBossEvaluationProps = {
  secretWord: string;
  categories: string[];
  onSubmitEvaluation: GenericFunction;
  onSubmitOutcome: GenericFunction;
  board: BoardObject;
  clues: Clues;
  finalAnswersLeft: number;
  players: GamePlayers;
  round: GameRound;
  outcome?: string;
};

export function StepBossEvaluation({
  secretWord,
  categories,
  onSubmitEvaluation,
  onSubmitOutcome,

  board,
  clues,
  finalAnswersLeft,
  players,
  round,
  outcome,
}: StepBossEvaluationProps) {
  const latestBoardEntry = board[round.current];

  return (
    <Step fullWidth>
      <StepTitle>
        <Translate pt="Avaliação" en="Avaliação" />
      </StepTitle>

      <CategoryWordGroup categories={categories} secretWord={secretWord} showSecretWord />

      <Board board={board} clues={clues} players={players} />

      <ClueEvaluation
        clues={clues}
        latestBoardEntry={latestBoardEntry}
        onSubmitEvaluation={onSubmitEvaluation}
      />

      <OutcomeOptions
        outcome={outcome}
        onSubmitOutcome={onSubmitOutcome}
        finalAnswersLeft={finalAnswersLeft}
      />
    </Step>
  );
}
