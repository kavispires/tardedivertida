// Hooks
import { useLoading } from '../../hooks';
// Components
import { Instruction, PopoverRule, ReadyPlayersBar, Title, Translate } from '../../components';
import WordGrid from './WordGrid';
import WritingCell from './WritingCell';
import { WritingCluesRule } from './RulesBlobs';

type StepClueWritingProps = {
  grid: CruzaPalavraGrid;
  user: GamePlayer;
  onSubmitClue: GenericFunction;
  players: GamePlayers;
};

function StepClueWriting({ grid, user, onSubmitClue, players }: StepClueWritingProps) {
  const [isLoading] = useLoading();

  const onSubmitClueClick = (payload: string) => {
    onSubmitClue({
      clue: payload.trim().toLowerCase(),
    });
  };

  return (
    <div className="x-step">
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

      <ReadyPlayersBar players={players} showNames />
    </div>
  );
}

export default StepClueWriting;
