// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { ReadyPlayersBar } from 'components/players';
import { WordGrid } from './components/WordGrid';
import { WritingCell } from './components/WritingCell';
import { WritingCluesRule } from './components/RulesBlobs';

type StepClueWritingProps = {
  grid: CruzaPalavraGrid;
  user: GamePlayer;
  onSubmitClue: GenericFunction;
  players: GamePlayers;
};

export function StepClueWriting({ grid, user, onSubmitClue, players }: StepClueWritingProps) {
  const { isLoading } = useLoading();

  const onSubmitClueClick = (payload: string) => {
    onSubmitClue({
      clue: payload.trim().toLowerCase(),
    });
  };

  return (
    <Step fullWidth>
      <Title>
        <Translate pt="Escreva sua dica" en="Write your clue" />
      </Title>

      <PopoverRule content={<WritingCluesRule playerCount={Object.keys(players).length} />} />

      <Instruction contained>
        <Translate
          pt="Clique no ícone azul e escreva sua dica. Sua dica deve conter apenas uma palavra."
          en="Click on the blue icon and write your clue. Your clue must be a single word clue."
        />
      </Instruction>

      <WordGrid
        grid={grid}
        user={user}
        CellComponent={WritingCell}
        cellComponentProps={{ onSubmitClue: onSubmitClueClick, disabled: isLoading }}
      />

      <ReadyPlayersBar players={players} />
    </Step>
  );
}
