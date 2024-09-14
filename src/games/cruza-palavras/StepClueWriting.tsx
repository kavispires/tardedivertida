// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import type { Grid, GridType } from './utils/types';
import { WordGrid } from './components/WordGrid';
import { WritingCell } from './components/WritingCell';
import { WritingCluesRule } from './components/RulesBlobs';

type StepClueWritingProps = {
  grid: Grid;
  gridType: GridType;
  user: GamePlayer;
  onSubmitClue: GenericFunction;
  players: GamePlayers;
} & Pick<StepProps, 'announcement'>;

export function StepClueWriting({
  grid,
  gridType,
  user,
  onSubmitClue,
  players,
  announcement,
}: StepClueWritingProps) {
  const { isLoading } = useLoading();

  const onSubmitClueClick = (payload: { clue: string; coordinate: number }) => {
    onSubmitClue({
      clue: payload.clue.trim().toLowerCase(),
      currentClueCoordinate: payload.coordinate,
    });
  };

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt="Escreva sua dica" en="Write your clue" />
      </Title>

      <PopoverRule content={<WritingCluesRule playerCount={Object.keys(players).length} />} />

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Clique em um dos ícones na grade e escreva sua dica.
              <br />
              Sua dica deve conter apenas <strong>uma palavra única</strong>.
              <br />
              Você <strong>NÃO</strong> pode usar nenhuma palavra que esteja na grade.
            </>
          }
          en={
            <>
              Click on the icon on either of the table cell and write your clue.
              <br />
              Your clue must be a <strong>single-word</strong> clue.
              <br />
              You can <strong>NOT</strong> use any words already in the table.
            </>
          }
        />
      </RuleInstruction>

      <WordGrid
        grid={grid}
        user={user}
        CellComponent={WritingCell}
        cellComponentProps={{ onSubmitClue: onSubmitClueClick, disabled: isLoading }}
        gridType={gridType}
      />
    </Step>
  );
}
