import { useEffect, useState } from 'react';
import useSound from 'use-sound';
// State & Hooks
import { useIsUserReady, useUser, useLanguage } from '../../hooks';
import { useOnSubmitDrawingAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  StepSwitcher,
  Translate,
} from '../../components';
import { StepDraw } from './StepDraw';

// Sound
const arteRuimTimer = require('../../sounds/arte-ruim-timer.mp3');

function PhaseDraw({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);
  const [secretCard, setSecretCard] = useState({});
  const [play] = useSound(arteRuimTimer, { volume: 0.4 });

  useEffect(() => {
    setSecretCard(players[user?.id]?.currentCard ?? {});
  }, [players, user?.id]);

  const onSubmitDrawing = useOnSubmitDrawingAPIRequest(setStep);

  const onStartDrawing = () => {
    play();
    setStep(2);
  };

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ARTE_RUIM.DRAW}>
      <StepSwitcher
        step={step}
        conditions={[!isUserReady, !isUserReady, !isUserReady]}
        players={players}
        waitingRoomInstruction={translate(
          'Vamos aguardar enquanto os outros jogadores terminam seus desenhos!',
          'Please wait while other players finish their artwork!'
        )}
      >
        {/* Step 0 */}
        <RoundAnnouncement round={state?.round} onPressButton={() => setStep(1)} buttonText=" " time={555}>
          <Instruction contained>
            <Translate
              pt={`Essa rodada usará cartas de nível ${state?.level || '?'}`}
              en={`This round uses cards of level ${state?.level || '?'}`}
            />
          </Instruction>
        </RoundAnnouncement>
        {/* Step 1 */}
        <PhaseAnnouncement
          type="painting"
          title={translate('Desenhe!', 'Draw!')}
          buttonText={translate('Um dó, lá, si... vamos ir... já!', 'Ready! Set! Go!')}
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
                  You can NOT use numbers or letters.
                  <br />
                  Be aware of the timer! It starts as soon as you press the button.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>
        {/* Step 2 */}
        <StepDraw secretCard={secretCard} onSubmitDrawing={onSubmitDrawing} />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseDraw;
