import PropTypes from 'prop-types';
import React from 'react';
import { useLanguage } from '../../../hooks';
// Components
import { translate, WaitingRoom } from '../../shared';

export function GuesserWaitingRoom({ players, instructionSuffix }) {
  const language = useLanguage();

  const instructionPrefix = translate(
    'Aguarde os outros jogadores',
    'Please wait while the other players',
    language
  );

  return (
    <WaitingRoom
      players={players}
      title={translate('Você é o(a) adivinhador(a)', "You're the guesser", language)}
      instruction={`${instructionPrefix} ${instructionSuffix[language]}.`}
    />
  );
}

GuesserWaitingRoom.propTypes = {
  instructionSuffix: PropTypes.shape({
    pt: PropTypes.string,
    en: PropTypes.string,
  }),
  players: PropTypes.object,
};
