// Types
import type { PhaseProps } from 'types/game';
import type { GamePlayer } from 'types/player';
// Icons
import { FlagIcon } from 'icons/FlagIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import { PlayerBoard } from './components/PlayersBoards';

export function PhaseGameOver({ state, players }: PhaseProps) {
  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<FlagIcon />}
    >
      <SpaceContainer wrap>
        {state.gallery.map((entry: GamePlayer) => {
          return (
            <PlayerBoard
              key={`result-${entry.characterId}`}
              player={entry}
              cardWidth={100}
              questionsDict={state.questionsDict}
              userCharacterId={entry.characterId}
            />
          );
        })}
      </SpaceContainer>
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
