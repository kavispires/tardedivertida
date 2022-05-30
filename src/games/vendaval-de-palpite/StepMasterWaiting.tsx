// Hooks
import { useLanguage } from 'hooks';
// Components
import { Translate } from 'components/language';
import { WaitingRoom } from 'components/players';
import { Step } from 'components/steps';
import { Board } from './components/Board';
import { CategoryWordGroup } from './components/CategoryWordGroup';

type StepMasterWaitingProps = {
  players: GamePlayers;

  board: VBoard;
  secretWord: string;
  categories: string[];
};

export function StepMasterWaiting({
  players,

  board,
  secretWord,
  categories,
}: StepMasterWaitingProps) {
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

      <Board players={players} board={board} />
    </Step>
  );
}
