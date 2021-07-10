import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Spin } from 'antd';
// Components
import { Instruction, Title } from '../../shared';
import { AvatarName } from '../../avatars';
import { ImageCardHand as Hand } from '../../cards';

function SecretClueWaiting({ leader, user }) {
  return (
    <div className="d-secret-clue-write">
      <Title>
        <Spin /> Aguarde...
      </Title>
      <Instruction contained>
        <AvatarName player={leader} addressUser /> está escrevendo a pista secreta.
        <br />
        Enquanto isso, examine suas cartas! Você as usará durante esta rodada.
      </Instruction>
      <Hand hand={user.hand} />
    </div>
  );
}

SecretClueWaiting.propTypes = {
  leader: PropTypes.shape({
    name: PropTypes.string,
  }),
  user: PropTypes.shape({
    hand: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default SecretClueWaiting;
