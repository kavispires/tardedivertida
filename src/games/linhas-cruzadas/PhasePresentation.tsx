// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { PhotoAlbumIcon } from '@icons/PhotoAlbumIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { LINHAS_CRUZADAS_PHASES } from './utils/constants';
import type { PhasePresentationState } from './utils/types';
import { StepAlbum } from './StepAlbum';

export function PhasePresentation({ state, players }: PhaseProps<PhasePresentationState>) {
  const { step, goToNextStep } = useStep(0);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={LINHAS_CRUZADAS_PHASES.PRESENTATION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<PhotoAlbumIcon />}
          title={
            <Translate
              pt="Álbum de Fotos"
              en="Photo Album"
            />
          }
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          unskippable
          duration={7}
          type="block"
        >
          <Surface>
            <Translate
              pt="A ordem dos albums será:"
              en="The albums' order will be:"
            />
            <PlayersTurnOrder
              players={players}
              order={state.gameOrder}
            />
          </Surface>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepAlbum
          players={players}
          album={state.album}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
