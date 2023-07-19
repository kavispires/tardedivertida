// Ant Design Resources
import { Space } from 'antd';
// Utils
import { getAvatarColorById, sortPlayers } from 'utils/helpers';
// Icons
import { FlagIcon } from 'icons/FlagIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Translate } from 'components/language';
import { Container } from 'components/general/Container';
import { AvatarStrip } from 'components/avatars';
import { PlayerMap } from './components/PlayerMap';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  const sortedPlayers = sortPlayers(players);
  const forest: Tree[] = state.forest ?? [];

  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<FlagIcon />}>
      <Container title={<Translate pt="Mapas dos Jogadores" en="Players' Maps" />}>
        {sortedPlayers.map((player) => {
          const mapTrees = (player.map ?? []).map((segment: MapSegment) => forest[segment.treeId]);
          return (
            <Space
              key={player.id}
              className="game-over-strip"
              style={{ borderColor: getAvatarColorById(player.avatarId) }}
            >
              <AvatarStrip player={player} withName className="game-over-avatar-strip" />
              <PlayerMap map={player.map} fullMap selectedTrees={mapTrees} />
            </Space>
          );
        })}
      </Container>
    </GameOverWrapper>
  );
}
