import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Components
import { PlayerAvatar, PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';

type VotingOptionsProps = {
  isAllDisabled: boolean;
  leaderId: PlayerId;
  players: GamePlayers;
  user?: GamePlayer;
  onVote: GenericFunction;
  isLoading?: boolean;
};

export function VotingOptions({
  players,
  leaderId,
  user,
  onVote,
  isLoading = false,
  isAllDisabled = false,
}: VotingOptionsProps) {
  const votingOptions = useMemo(
    () =>
      orderBy(
        Object.values(players).filter((player) => player.id !== leaderId),
        ['name'],
        ['asc'],
      ),
    [players, leaderId],
  );

  return (
    <SpaceContainer className="d-voting-options">
      {votingOptions?.map((playerOption) => {
        const votedForPlayer = Object.values(players).filter((player) => player?.vote === playerOption.id);
        return (
          <div className="d-voting-options__container" key={`voting-button-${playerOption.name}`}>
            <Button
              onClick={() => onVote({ vote: playerOption.id })}
              ghost
              size="large"
              disabled={isAllDisabled || user?.vote || isLoading || user?.name === playerOption.name}
            >
              <PlayerAvatarName player={playerOption} uppercase />
            </Button>
            <div className="d-voting-options__vote-container">
              <Translate pt="Votos" en="Votes" />: {votedForPlayer.length}
              <ul className="d-voting-options__votes">
                {votedForPlayer.map((vPlayer) => (
                  <PlayerAvatar
                    key={`voted-for-player-${vPlayer.id}`}
                    avatarId={vPlayer.avatarId}
                    size="small"
                    alt={vPlayer.name}
                  />
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </SpaceContainer>
  );
}
