import PropTypes from 'prop-types';
import React from 'react';
// Components
import { Instruction } from './Instruction';
import { Translate } from './Translate';

export function RoundsLeftInstruction({ round }) {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Faltam <strong>{(round?.total ?? 0) - (round?.current ?? 0)}</strong> rodadas para o jogo
            terminar...
          </>
        }
        en={
          <>
            <strong>{(round?.total ?? 0) - (round?.current ?? 0)}</strong> rounds left for the game to end...
          </>
        }
      />
    </Instruction>
  );
}
RoundsLeftInstruction.propTypes = {
  round: PropTypes.shape({
    current: PropTypes.number,
    total: PropTypes.number,
  }),
};
