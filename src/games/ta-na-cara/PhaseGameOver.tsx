// Ant Design Resources
import { Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
import type { GamePlayer } from 'types/player';
// Icons
import { FlagIcon } from 'icons/FlagIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { PlayerBoard } from './components/PlayersBoards';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<FlagIcon />}>
      <Space className="space-container" wrap>
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
      </Space>
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
