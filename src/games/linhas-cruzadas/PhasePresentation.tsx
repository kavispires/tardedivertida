// State & Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { PhotoAlbumIcon } from 'icons/PhotoAlbumIcon';
// Components
import { TurnOrder } from 'components/players';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { StepSwitcher } from 'components/steps';
import { StepAlbum } from './StepAlbum';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

function PhasePresentation({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep } = useStep(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.LINHAS_CRUZADAS.PRESENTATION}>
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
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

export default PhasePresentation;
