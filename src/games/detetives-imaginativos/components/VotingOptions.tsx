import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';

type VotingOptionsProps = {
  isAllDisabled: boolean;
  leaderId: UID;
  players: GamePlayers;
  user?: GamePlayer;
  onVote?: (payload: { vote: UID }) => void;
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
    <SpaceContainer className="d-voting-options contained">
      {votingOptions?.map((playerOption) => {
        const votedForPlayer = Object.values(players).filter((player) => player?.vote === playerOption.id);
        return (
          <div
            className="d-voting-options__container"
            key={`voting-button-${playerOption.name}`}
          >
            {onVote ? (
              <SendButton
                onClick={() => onVote({ vote: playerOption.id })}
                ghost
                size="large"
                disabled={isAllDisabled || user?.vote || isLoading || user?.name === playerOption.name}
              >
                <PlayerAvatarName
                  player={playerOption}
                  uppercase
                />
              </SendButton>
            ) : (
              <PlayerAvatarName
                player={playerOption}
                uppercase
              />
            )}

            <div className="d-voting-options__vote-container">
              <Translate
                pt="Votos"
                en="Votes"
              />
              : {votedForPlayer.length}
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
