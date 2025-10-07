import { useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { WritingIcon } from 'icons/WritingIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitObjectAPIRequest } from './utils/api-requests';
import { MESMICE_PHASES } from './utils/constants';
import { PlayerObjectClueFeature } from './components/PlayerObjectClueFeature';
import { StepSelectObject } from './StepObjectSelection';
import { StepWriteClue } from './StepWriteClue';

export function PhaseClueWriting({ state, players, user }: PhaseProps) {
  const { step, setStep, goToNextStep, goToPreviousStep } = useStep();
  const [objectId, setObjectId] = useState<string>('');

  const onSelectObject = (id: string) => {
    setObjectId(id);
    goToNextStep();
  };

  const onSubmitClue = useOnSubmitObjectAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<WritingIcon />}
      title={<Translate pt="Objeto e característica" en="Object vs Feature" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Neste jogo, você escreverá uma dica que melhor conecta seu objeto com a característica sorteada.
            </>
          }
          en={
            <>
              In this game, you will write a clue that best connects your object with the assigned
              characteristic.
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={MESMICE_PHASES.CLUE_WRITING}>
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{ content: <PlayerObjectClueFeature user={user} features={state.features} /> }}
      >
        {/* Step 0 */}
        <StepSelectObject user={user} onSelectObject={onSelectObject} announcement={announcement} />

        {/* Step 1 */}
        <StepWriteClue
          user={user}
          features={state.features}
          goToPreviousStep={goToPreviousStep}
          onSubmitClue={onSubmitClue}
          selectedObjectId={objectId}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
