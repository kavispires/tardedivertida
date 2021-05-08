import React, { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { message, notification } from 'antd';
// Hooks
import { useGlobalState } from '../../hooks';
import { useLoading } from '../../hooks';
// Resources & Utils
import { UM_SO_API } from '../../adapters';
import { UM_SO_PHASES } from '../../utils/constants';
// Components
import PhaseContainer from '../shared/PhaseContainer';
import WaitingRoom from '../shared/WaitingRoom';
import StepSwitcher from '../shared/StepSwitcher';
import SuggestionStep from './SuggestionStep';

function SuggestPhase({ state, players, info }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [step, setStep] = useState(0);
  const [amIReady, setImReady] = useState(false);
  const [guesser, setGuesser] = useState(players[state.guesser]);
  const [amITheGuesser, setAmITheGuesser] = useState(false);

  // Determine if user is the guesser
  useEffect(() => {
    setGuesser(players[state.guesser]);
    setAmITheGuesser(state.guesser === me);
  }, [state.guesser, me, players]);

  const onSendSuggestions = useCallback(
    async (suggestions) => {
      try {
        setLoader('submit-suggestion', true);
        setStep(1);
        const response = await UM_SO_API.submitSuggestions({
          gameId,
          gameName,
          playerName: me,
          suggestions,
        });

        if (response.data) {
          setImReady(true);
          message.success(
            'Sugestão enviada com successo! Aguarde enquanto os outros participantes escrevem suas dicas'
          );
        }
      } catch (e) {
        notification.error({
          message: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua(s) dica(s)',
          description: JSON.stringify(e),
          placement: 'bottomLeft',
        });
        console.error(e);
        setStep(0);
      } finally {
        setLoader('submit-suggestion', false);
      }
    },
    [gameId, gameName, me, setLoader]
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={UM_SO_PHASES.SUGGEST}
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
              secretWordId={state.secretWordId}
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
