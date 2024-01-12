// Types
import type { GamePlayers } from 'types/player';
import type { GameRound } from 'types/game';
import type { Clues, BoardObject } from './utils/types';
// Components
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Translate } from 'components/language';
import { Board } from './components/Board';
import { CategoryWordGroup } from './components/CategoryWordGroup';
import { OutcomeOptions } from './components/OutcomeOptions';
import { ClueEvaluation } from './components/ClueEvaluation';

type StepBossEvaluationProps = {
  secretWord: string;
  categories: string[];
  onSubmitEvaluation: Function;
  onSubmitOutcome: Function;
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
      <Title size="medium">
        <Translate pt="Avaliação" en="Avaliação" />
      </Title>

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
