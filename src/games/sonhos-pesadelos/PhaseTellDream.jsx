import { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useIsUserReady, useAPICall, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { SONHOS_PESADELOS_API } from '../../adapters';
import { PHASES } from '../../utils/phases';
// Components
import {
  WaitingRoom,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  Translate,
  translate,
} from '../../components/shared';
import { ImageCardPreloadHand } from '../../components/cards';
import StepTellDream from './StepTellDream';
import DreamBoard from './DreamBoard';

function PhaseTellDream({ state, players, info }) {
  const language = useLanguage();
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);

  const onSubmitDream = useAPICall({
    apiFunction: SONHOS_PESADELOS_API.submitAction,
    actionName: 'submit-dreams',
    onBeforeCall: () => setStep(3),
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
      allowedPhase={PHASES.SONHOS_PESADELOS.TELL_DREAM}
      className="s-tell-dream-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} buttonText="" onPressButton={() => setStep(1)} time={5}>
          <Instruction contained>
            <Translate
              pt="Somos paranormais tentando adivinhar os sonhos dos outros..."
              en="We're psychics trying to guess each others dreams..."
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="dream"
          title={translate('Conte-nos sobre seu sonho', 'Tell us about your dream...', language)}
          onClose={() => setStep(2)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Escreva uma dica para cada um dos seus sonhos (cartas com bordas amarelas).
                  <br />
                  Preste atenção em seus pesadelos (cartas com bordas pretas), se alguém achar que alguma de
                  suas dicas é relacionada a um pesadelo, você não pode ganhar nessa rodada.
                  <br />
                  Você tem {state.dreamsCount} sonho(s) e {state.nightmaresCount} pesadelo(s).
                </>
              }
              en={
                <>
                  Write a clue for each of your dreams (yellow bordered cards.
                  <br />
                  Pay attention to your nightmares (black bordered cards). If a player thinks any of your
                  clues is related to a nightmare, you can not win this round.
                  <br />
                  You have {state.dreamsCount} dream(s) e {state.nightmaresCount} nightmare(s).
                </>
              }
            />
          </Instruction>
          <ImageCardPreloadHand hand={state.table.map((e) => e.cardId)} />
        </PhaseAnnouncement>

        {/* Step 2 */}
        <Step fullWidth>
          <StepTellDream
            players={players}
            theme={state.theme}
            user={user}
            table={state.table}
            onSubmitDream={onSubmitDream}
            dreamsCount={state.dreamsCount}
            currentRound={state.round.current}
          />
        </Step>

        {/* Step 3 */}
        <Step fullWidth>
          <WaitingRoom players={players} />
          <DreamBoard user={user} table={state.table} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseTellDream.propTypes = {
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

export default PhaseTellDream;
