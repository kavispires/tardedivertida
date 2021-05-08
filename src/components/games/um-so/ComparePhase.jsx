import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { message, notification } from 'antd';
// Hooks
import { useGlobalState } from '../../../hooks';
import { useLoading } from '../../../hooks';
// Resources & Utils
import { UM_SO_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import WaitingRoom from '../../shared/WaitingRoom';
import StepSwitcher from '../../shared/StepSwitcher';
import CompareSuggestionsStep from './CompareSuggestionsStep';

function ComparePhase({ state, players, info }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [step, setStep] = useState(0);
  const [amITheGuesser, setAmITheGuesser] = useState(false);

  // Determine if user is the guesser
  useEffect(() => {
    setAmITheGuesser(state.guesser === me);
  }, [state.guesser, me, players]);

  const onValidateSuggestions = useCallback(
    async (validationArray) => {
      try {
        setLoader('validate-suggestions', true);
        setStep(1);
        const response = await UM_SO_API.submitValidation({
          gameId,
          gameName,
          playerName: me,
          validSuggestions: validationArray.filter((suggestion) => !suggestion.invalid),
        });

        if (response.data) {
          message.success('Validação enviada com sucesso!');
        }
      } catch (e) {
        notification.error({
          message: 'Vixi, o aplicativo encontrou um erro ao tentar enviar a confirmação das sugestões',
          description: JSON.stringify(e),
          placement: 'bottomLeft',
        });
        console.error(e);
        setStep(0);
      } finally {
        setLoader('validate-suggestions', false);
      }
    },
    [gameId, gameName, me, setLoader]
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.UM_SO.COMPARE}
      className="u-compare-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <div className="u-compare-phase__step">
          {amITheGuesser ? (
            <WaitingRoom
              players={players}
              title="Você é o(a) adivinhador(a)"
              instruction="Aguarde os outros jogadores selecionarem as dicas válidas."
            />
          ) : (
            <CompareSuggestionsStep
              nextGuesser={state.nextGuesser}
              secretWordId={state.secretWordId}
              suggestions={state.suggestions}
              me={me}
              players={players}
              onValidateSuggestions={onValidateSuggestions}
            />
          )}
        </div>

        {/* Step 1 */}
        <WaitingRoom players={players} title="Enviando a confirmação de sugestões" instruction="Aguarde..." />
      </StepSwitcher>
    </PhaseContainer>
  );
}

ComparePhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default ComparePhase;
