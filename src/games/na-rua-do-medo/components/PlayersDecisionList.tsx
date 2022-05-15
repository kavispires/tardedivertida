// Ant Design Resources
import { Tooltip } from 'antd';
// Components
import { AvatarIcon, AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { CostumeAvatar } from './CostumeAvatar';

type PlayersDecisionListProps = {
  players: GamePlayers;
  playersIdsList: PlayerId[];
  type: 'home' | 'walk';
};

export function PlayersDecisionList({ playersIdsList, players, type }: PlayersDecisionListProps) {
  const isWalk = type === 'walk';

  const playersList = playersIdsList.map((playerId) => players[playerId]);

  return (
    <div className="n-players-decision-list">
      <h4 className="n-players-decision-list__title">
        <Tooltip
          title={
            type === 'home' ? (
              <Translate en="Already at home" pt="Jogadores em casa" />
            ) : (
              <Translate en="Trick or treating players" pt="Jogadores caminhando" />
            )
          }
        >
          <AvatarIcon type={isWalk ? 'walk' : 'house'} />
        </Tooltip>
      </h4>
      <ul className="n-players-decision-list__players">
        {playersList.length > 0 ? (
          playersList.map((player) => {
            return (
              <div key={`continuing-player-${player.id}`} className="n-players-decision-list__player">
                <CostumeAvatar id={player.avatarId} costumeId={player.costumeId} />
                {player.name}
              </div>
            );
          })
        ) : (
          <span className="n-players-decision-list__player">
            <Translate pt="Ninguém foi pra casa" en="Nobody went home" />
          </span>
        )}
      </ul>
    </div>
  );
}
