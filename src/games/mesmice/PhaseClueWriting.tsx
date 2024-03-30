// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { WritingIcon } from 'icons/WritingIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { useState } from 'react';
import { StepSelectObject } from './StepObjectSelection';
import { StepWriteClue } from './StepWriteClue';
import { useOnSubmitObjectAPIRequest } from './utils/api-requests';
import { PlayerObjectClueFeature } from './components/PlayerObjectClueFeature';

export function PhaseClueWriting({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.MESMICE.CLUE_WRITING}>
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
