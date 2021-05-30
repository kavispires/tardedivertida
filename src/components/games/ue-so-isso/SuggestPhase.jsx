import React, { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { message, notification } from 'antd';
// Hooks
import { useGlobalState, useLoading, useIsUserReady, useActivePlayer, useIsUserThe } from '../../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import WaitingRoom from '../../shared/WaitingRoom';
import StepSwitcher from '../../shared/StepSwitcher';
import SuggestionStep from './SuggestionStep';

function SuggestPhase({ state, players, info }) {
  const [, setLoader] = useLoading();
  const amIReady = useIsUserReady(players, state);
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [username] = useGlobalState('username');
  const [step, setStep] = useState(0);
  const guesser = useActivePlayer(state, players, 'guesser');
  const amITheGuesser = useIsUserThe('guesser', state);

  const onSendSuggestions = useCallback(
    async (suggestions) => {
      try {
        setLoader('submit-suggestion', true);
        setStep(1);
        const response = await UE_SO_ISSO_API.submitSuggestions({
          gameId,
          gameName,
          playerName: username,
          suggestions,
        });

        if (response.data) {
          message.success(
            'Sugestão enviada com successo! Aguarde enquanto os outros participantes escrevem suas dicas'
          );
        }
      } catch (e) {
        notification.error({
          message: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua(s) dica(s)',
          description: JSON.stringify(e.message),
          placement: 'bottomLeft',
        });
        console.error(e);
        setStep(0);
      } finally {
        setLoader('submit-suggestion', false);
      }
    },
    [gameId, gameName, username, setLoader]
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.UE_SO_ISSO.SUGGEST}
      className="word-selection-phase"
    >
      <StepSwitcher step={step} conditions={[!amIReady]}>
        {/* Step 0 */}
        <Fragment>
          {amITheGuesser ? (
            <WaitingRoom
              players={players}
              title="Você é o(a) adivinhador(a)"
              instruction="Aguarde os outros jogadores decidirem a palavra secreta."
            />
          ) : (
            <SuggestionStep
              guesser={guesser}
              onSendSuggestions={onSendSuggestions}
              secretWord={state.secretWord}
              suggestionsNumber={state.suggestionsNumber}
            />
          )}
        </Fragment>

        {/* Step 1 */}
        <WaitingRoom players={players} title="Pronto!" instruction="Vamos aguardar os outros joadores." />
      </StepSwitcher>
    </PhaseContainer>
  );
}

SuggestPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default SuggestPhase;
