// Types
import type { GamePlayers } from 'types/player';
// Components
import { Translate } from 'components/language';
import { WaitingRoom } from 'components/players';
import { Step } from 'components/steps';
// Internal
import type { Clues, BoardObject } from './utils/types';
import { Board } from './components/Board';
import { CategoryWordGroup } from './components/CategoryWordGroup';

type StepBossWaitingProps = {
  players: GamePlayers;
  board: BoardObject;
  clues: Clues;
  secretWord: string;
  categories: string[];
};

export function StepBossWaiting({ players, board, clues, secretWord, categories }: StepBossWaitingProps) {
  return (
    <Step fullWidth>
      <WaitingRoom
        players={players}
        title={
          <Translate
            pt="Aguarde"
            en="Please wait"
          />
        }
        instruction={
          <Translate
            pt="Os jogadores estão escrevendo dicas"
            en="The players are writing clues"
          />
        }
      />

      <CategoryWordGroup
        categories={categories}
        secretWord={secretWord}
        showSecretWord
      />

      <Board
        players={players}
        clues={clues}
        board={board}
      />
    </Step>
  );
}
