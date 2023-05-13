// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { WordGrid } from './components/WordGrid';
import { WritingCell } from './components/WritingCell';
import { WritingCluesRule } from './components/RulesBlobs';

type StepClueWritingProps = {
  grid: CruzaPalavraGrid;
  user: GamePlayer;
  onSubmitClue: GenericFunction;
  players: GamePlayers;
} & AnnouncementProps;

export function StepClueWriting({ grid, user, onSubmitClue, players, announcement }: StepClueWritingProps) {
  const { isLoading } = useLoading();

  const onSubmitClueClick = (payload: string) => {
    onSubmitClue({
      clue: payload.trim().toLowerCase(),
    });
  };

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt="Escreva sua dica" en="Write your clue" />
      </Title>

      <PopoverRule content={<WritingCluesRule playerCount={Object.keys(players).length} />} />

      <Instruction contained>
        <Translate
          pt={
            <>
              Clique no ícone na grade e escreva sua dica.
              <br />
              Sua dica deve conter apenas <strong>uma palavra única</strong>.
              <br />
              Você <strong>NÃO</strong> pode usar nenhuma palavra que esteja na grade.
            </>
          }
          en={
            <>
              Click on the icon on the table cell and write your clue.\
              <br />
              Your clue must be a <strong>single-word</strong> clue.
              <br />
              You can <strong>NOT</strong> use any words already in the table.
            </>
          }
        />
      </Instruction>

      <WordGrid
        grid={grid}
        user={user}
        CellComponent={WritingCell}
        cellComponentProps={{ onSubmitClue: onSubmitClueClick, disabled: isLoading }}
      />
    </Step>
  );
}
