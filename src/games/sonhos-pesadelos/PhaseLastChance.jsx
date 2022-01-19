import { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useIsUserReady, useAPICall, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { SONHOS_PESADELOS_API } from '../../adapters';
import { PHASES } from '../../utils/phases';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  StepSwitcher,
  Translate,
  translate,
} from '../../components';
import { DreamBoard } from './DreamBoard';
import { StepMatchDreams } from './StepMatchDreams';

function PhaseLastChance({ state, players, info }) {
  const language = useLanguage();
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);

  const onSubmitDream = useAPICall({
    apiFunction: SONHOS_PESADELOS_API.submitAction,
    actionName: 'submit-dreams',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
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
      className="s-phase"
    >
      <StepSwitcher
        step={step}
        conditions={[!isUserReady]}
        players={players}
        waitingRoomContent={<DreamBoard user={user} table={state.table} />}
      >
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} buttonText="" onPressButton={() => setStep(1)} time={5}>
          <Instruction contained>
            <Translate
              pt="E não era pra ter somente 5 rodadas?"
              en="Weren't we supposed to have only 5 rounds?"
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="knowledge"
          title={translate('Última Chance!', 'Last Chance', language)}
          onClose={() => setStep(2)}
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

        {/* Step 2 */}
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
