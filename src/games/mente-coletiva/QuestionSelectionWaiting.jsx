import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Instruction, Title, Translate } from '../../components/shared';
import { AvatarName } from '../../components/avatars';
import { LoadingClock } from '../../components/icons';
import { Pasture } from './Pasture';
import { RoundType } from './RoundType';

function QuestionSelectionWaiting({ activePlayer, players, roundType }) {
  return (
    <div className="m-step">
      <Title>
        <LoadingClock /> <Translate pt="Aguarde..." en="Please wait..." />
      </Title>

      <RoundType roundType={roundType} />

      <Instruction contained>
        <AvatarName player={activePlayer} addressUser />{' '}
        <Translate pt="está escolhendo a pergunta da rodada." en="is choosing the question for the round." />
        <br />
      </Instruction>

      <Pasture players={players} />
    </div>
  );
}

QuestionSelectionWaiting.propTypes = {
  activePlayer: PropTypes.shape({
    avatarId: PropTypes.string,
    name: PropTypes.string,
  }),
  players: PropTypes.object,
  roundType: PropTypes.number,
};

export default QuestionSelectionWaiting;
