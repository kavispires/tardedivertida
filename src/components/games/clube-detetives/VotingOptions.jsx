import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button } from 'antd';
// Components
import { Avatar, AvatarName } from '../../avatars';
import { ButtonContainer } from '../../shared';
import { orderBy } from '../../../utils';

export function VotingOptions({ players, leader, user, onVote, isLoading }) {
  const votingOptions = useMemo(
    () =>
      orderBy(
        Object.values(players).filter((playerId) => playerId !== leader),
        'name'
      ),
    [players, leader]
  );

  return (
    <ButtonContainer className="d-voting-options">
      {votingOptions?.map((playerOption) => {
        const votedForPlayer = Object.values(players).filter((player) => player?.vote === playerOption.name);
        return (
          <div className="d-voting-options__container" key={`voting-button-${playerOption.name}`}>
            <Button
              onClick={() => onVote(playerOption.name)}
              ghost
              size="large"
              disabled={user.vote || isLoading || user.name === playerOption.name}
            >
              <AvatarName player={playerOption} uppercase />
            </Button>
            <div className="d-voting-options__vote-container">
              Votos: {votedForPlayer.length}
              <ul className="d-voting-options__votes">
                {votedForPlayer.map((vPlayer) => (
                  <Avatar id={vPlayer.avatarId} size="small" alt={vPlayer.name} />
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </ButtonContainer>
  );
}

VotingOptions.propTypes = {
  leader: PropTypes.string,
  onVote: PropTypes.func,
  players: PropTypes.object,
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
};

export default VotingOptions;
