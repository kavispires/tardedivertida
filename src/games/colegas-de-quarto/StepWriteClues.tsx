// Types
import type { GameRound } from 'types/game';
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { Instruction, StepTitle } from 'components/text';
// Internal
import type { BoardEntry, HouseHappiness, PlayerAssignedPair } from './utils/types';
import { StoreBoard } from './components/StoreBoard';

type StepWriteCluesProps = {
  players: GamePlayers;
  user: GamePlayer;
  board: BoardEntry[];
  happiness: HouseHappiness;
  round: GameRound;
} & Pick<StepProps, 'announcement'>;

export function StepWriteClues({
  announcement,
  board,
  happiness,
  user,
  players,
  round,
}: StepWriteCluesProps) {
  const { isLoading } = useLoading();
  const assignedPairs: PlayerAssignedPair[] = players[user.id]?.assignedPairs || [];

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={<>?</>}
          en={<>?</>}
        />
      </StepTitle>

      {isLoading}
      <Instruction contained>
        <Translate
          pt={<>?</>}
          en={<>?</>}
        />
      </Instruction>

      <StoreBoard
        board={board}
        round={round}
      />
    </Step>
  );
}
