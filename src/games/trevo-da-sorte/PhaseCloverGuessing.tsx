// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useLanguage } from 'hooks/useLanguage';
import {
  useOnSubmitCluesAPIRequest,
  useOnSubmitGuessAPIRequest,
  useOnUpdateCloverStateAPIRequest,
} from './utils/api-requests';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TDIcon } from 'components/icons/TDIcon';

import { Translate } from 'components/language';
import { StepWriteClues } from './StepWriteClues';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { StepGuessClover } from './StepGuessClover';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function PhaseCloverGuessing({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players);
  const [controller, isUserTheController] = useWhichPlayerIsThe('controllerId', state, players);
  const [activeCloverPlayer, isUserTheCloverPlayer] = useWhichPlayerIsThe('controllerId', state, players);

  const onSubmitGuess = useOnSubmitGuessAPIRequest(setStep);
  const onUpdateCloverState = useOnUpdateCloverStateAPIRequest();

  return (
    <DndProvider backend={HTML5Backend}>
      <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TREVO_DA_SORTE.CLOVER_GUESSING}>
        <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
          {/* Step 0 */}
          <PhaseAnnouncement
            icon={<TDIcon />}
            title={translate('Hora de Adivinhar', 'Time to guess')}
            onClose={goToNextStep}
            currentRound={state?.round?.current}
          >
            <Instruction>
              <Translate
                pt="De um em um, vamos tentar adivinhar a posição das folhas em cada trevo"
                en="One at a time, let's try to guess the position of each leaf on each clover"
              />
            </Instruction>
          </PhaseAnnouncement>

          {/* Step 1 */}
          <StepGuessClover
            clover={state.clover}
            leaves={state.leaves}
            onSubmitGuess={onSubmitGuess}
            onUpdateCloverState={onUpdateCloverState}
            controller={controller}
            isUserTheController={isUserTheController}
            activeCloverPlayer={activeCloverPlayer}
            isUserTheCloverPlayer={isUserTheCloverPlayer}
          />
        </StepSwitcher>
      </PhaseContainer>
    </DndProvider>
  );
}

export default PhaseCloverGuessing;