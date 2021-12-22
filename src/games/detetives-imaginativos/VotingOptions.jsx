import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
// Design Resources
import { Button } from 'antd';
// Components
import { Avatar, AvatarName } from '../../components/avatars';
import { ButtonContainer, Translate } from '../../components/shared';

export function VotingOptions({ players, leaderId, user, onVote, isLoading, isAllDisabled }) {
  const votingOptions = useMemo(
    () =>
      orderBy(
        Object.values(players).filter((player) => player.id !== leaderId),
        ['name'],
        ['asc']
      ),
    [players, leaderId]
  );

  return (
    <ButtonContainer className="d-voting-options">
      {votingOptions?.map((playerOption) => {
        const votedForPlayer = Object.values(players).filter((player) => player?.vote === playerOption.id);
        return (
          <div className="d-voting-options__container" key={`voting-button-${playerOption.name}`}>
            <Button
              onClick={() => onVote(playerOption.id)}
              ghost
              size="large"
              disabled={isAllDisabled || user.vote || isLoading || user.name === playerOption.name}
            >
              <AvatarName player={playerOption} uppercase />
            </Button>
            <div className="d-voting-options__vote-container">
              <Translate pt="Votos" en="Votes" />: {votedForPlayer.length}
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
  isAllDisabled: PropTypes.any,
  isLoading: PropTypes.bool,
  leaderId: PropTypes.string,
  onVote: PropTypes.func,
  players: PropTypes.object,
  user: PropTypes.shape({
    name: PropTypes.string,
    vote: PropTypes.any,
  }),
};

export default VotingOptions;
