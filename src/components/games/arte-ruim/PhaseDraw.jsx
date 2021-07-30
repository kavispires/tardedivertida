import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
// State & Hooks
import { useIsUserReady, useAPICall, useUser, useLanguage } from '../../../hooks';
// Resources & Utils
import { ARTE_RUIM_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
import arteRuimTimer from '../../../sounds/arte-ruim-timer.mp3';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  translate,
  Translate,
  WaitingRoom,
} from '../../shared';
import DrawPhaseDrawStep from './DrawPhaseDrawStep';

function PhaseDraw({ players, state, info }) {
  const isUserReady = useIsUserReady(players, state);
  const language = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);
  const [secretCard, setSecretCard] = useState({});
  const [play] = useSound(arteRuimTimer, { volume: 0.4 });

  useEffect(() => {
    setSecretCard(players[user?.id]?.currentCard ?? {});
  }, [players, user?.id]);

  const onSubmitDrawing = useAPICall({
    apiFunction: ARTE_RUIM_API.submitDrawing,
    actionName: 'submit-drawing',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate(
      'Acabou o tempo! Aguarde enquanto os outros participantes desenham',
      "Time's up! Wait for the other players to finish their art",
      language
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar o desenho',
      'Oops, the application fail to send your art',
      language
    ),
  });

  const onStartDrawing = () => {
    play();
    setStep(2);
  };

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ARTE_RUIM.DRAW} className="a-phase">
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]}>
        {/* Step 0 */}
        <RoundAnnouncement round={state?.round} onPressButton={() => setStep(1)} buttonText=" " time={5} />

        {/* Step 1 */}
        <PhaseAnnouncement
          type="painting"
          title={translate('Desenhe!', 'Draw!', language)}
          buttonText={translate('Um dó, lá, si... vamos ir... já!', 'Ready! Set! Go!', language)}
          onClose={onStartDrawing}
          currentRound={state?.round?.current}
          withoutTimer
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Você terá 10 segundos para ler a sua carta e desenhá-la.
                  <br />
                  Aperte o botão quando estiver pronto!
                  <br />
                  Não vale usar números e letras.
                  <br />
                  Fique esperto porque o tempo começa assim que você apertar.
                </>
              }
              en={
                <>
                  You'll have 10 seconds to read and draw your card.
                  <br />
                  Press the button when you're ready!
                  <br />
                  You can use numbers or letters.
                  <br />
                  Be aware of the timer! It starts as soon as you press the button.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <DrawPhaseDrawStep secretCard={secretCard} onSubmitDrawing={onSubmitDrawing} />

        {/* Step 3 */}
        <Step fullWidth>
          <WaitingRoom
            players={players}
            title={translate('Pronto!', 'Done!', language)}
            instruction={translate(
              'Vamos aguardar enquanto os outros jogadores terminam seus desenhos!',
              'Please wait while other players finish their artwork!',
              language
            )}
          />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseDraw.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    round: PropTypes.shape({ current: PropTypes.number, total: PropTypes.number }),
  }),
};

export default PhaseDraw;
