import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useIsUserReady, useAPICall, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { SONHOS_PESADELOS_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  DefaultWaitingRoom,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Translate,
  translate,
} from '../../components/shared';
import DreamBoard from './DreamBoard';
import StepMatchDreams from './StepMatchDreams';

function PhaseLastChance({ state, players, info }) {
  const language = useLanguage();
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);

  const onSubmitDream = useAPICall({
    apiFunction: SONHOS_PESADELOS_API.submitAction,
    actionName: 'submit-dreams',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Sonhos submetidos com sucesso', 'Dreams submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seus sonhos',
      'Oops, the application found an error while trying to submit your dreams',
      language
    ),
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.SONHOS_PESADELOS.LAST_CHANCE}
      className="s-tell-dream-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="default"
          title={translate('Última Chance!', 'Last Chance', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Já que ninguém ganhou até agora, você tem uma última chance de marcar os pares corretos.
                  <br />
                  Dessa vez, quem acertar o maior número de pares ganha.
                </>
              }
              en={
                <>
                  Since nobody won so far, you have a last chance to match the pairs correctly.
                  <br />
                  This time, whoever gets the most matches win.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <StepMatchDreams
            players={players}
            theme={state.theme}
            user={user}
            table={state.table}
            onSubmitDream={onSubmitDream}
            dreamsCount={state.dreamsCount}
            clues={state.clues}
            currentRound={state?.round?.current}
          />
        </Step>

        {/* Step 2 */}
        <Step fullWidth>
          <DefaultWaitingRoom players={players} />
          <DreamBoard user={user} table={state.table} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseLastChance.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};

export default PhaseLastChance;
