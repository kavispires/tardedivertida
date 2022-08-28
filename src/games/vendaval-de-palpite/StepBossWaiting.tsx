// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Translate } from 'components/language';
import { WaitingRoom } from 'components/players';
import { Step } from 'components/steps';
import { Board } from './components/Board';
import { CategoryWordGroup } from './components/CategoryWordGroup';

type StepBossWaitingProps = {
  players: GamePlayers;
  board: VBoard;
  clues: VClues;
  secretWord: string;
  categories: string[];
};

export function StepBossWaiting({ players, board, clues, secretWord, categories }: StepBossWaitingProps) {
  const { translate } = useLanguage();

  return (
    <Step fullWidth>
      <WaitingRoom
        players={players}
        title={translate('Aguarde', 'Please wait')}
        instruction={
          <Translate pt="Os jogadores estão escrevendo dicas" en="The players are writing clues" />
        }
      />

      <CategoryWordGroup categories={categories} secretWord={secretWord} showSecretWord />

      <Board players={players} clues={clues} board={board} />
    </Step>
  );
}
