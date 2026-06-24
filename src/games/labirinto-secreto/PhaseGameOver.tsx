// Ant Design Resources
import { Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSortedPlayers } from '@hooks/useSortedPlayers';
// Utils
import { getAvatarColorById } from '@utils/helpers';
// Icons
import { FlagIcon } from '@icons/FlagIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
import { PlayerAvatarStrip } from '@components/player/PlayerAvatarStrip';
import { GameOverWrapper } from '@components/wrappers/GameOverWrapper';
// Internal
import type { MapSegment, PhaseGameOverState, Tree } from './utils/types';
import { achievementsReference } from './utils/achievements';
import { PlayerMap } from './components/PlayerMap';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const sortedPlayers = useSortedPlayers(players);
  const forest: Tree[] = state.forest ?? [];

  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<FlagIcon />}
    >
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />
      <TitledContainer
        title={
          <Translate
            pt="Mapas dos Jogadores"
            en="Players' Maps"
          />
        }
      >
        {sortedPlayers.map((player) => {
          const mapTrees = (player.map ?? []).map((segment: MapSegment) => forest[segment.treeId]);
          return (
            <Space
              key={player.id}
              className="game-over-strip"
              style={{ borderColor: getAvatarColorById(player.avatarId) }}
            >
              <PlayerAvatarStrip
                player={player}
                withName
                className="game-over-avatar-strip"
              />
              <PlayerMap
                map={player.map}
                fullMap
                selectedTrees={mapTrees}
              />
            </Space>
          );
        })}
      </TitledContainer>
    </GameOverWrapper>
  );
}
