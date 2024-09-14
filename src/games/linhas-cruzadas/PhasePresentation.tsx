// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { PhotoAlbumIcon } from 'icons/PhotoAlbumIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TurnOrder } from 'components/players';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { StepAlbum } from './StepAlbum';

export function PhasePresentation({ players, state, info }: PhaseProps) {
  const { step, goToNextStep } = useStep(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.LINHAS_CRUZADAS.PRESENTATION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<PhotoAlbumIcon />}
          title={<Translate pt="Álbum de Fotos" en="Photo Album" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          unskippable
          duration={7}
          type="block"
        >
          <Instruction>
            <Translate pt="A ordem dos albums será:" en="The albums' order will be:" />
            <TurnOrder players={players} order={state.gameOrder} />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepAlbum players={players} album={state.album} />
      </StepSwitcher>
    </PhaseContainer>
  );
}
