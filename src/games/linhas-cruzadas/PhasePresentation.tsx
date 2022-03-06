// State & Hooks
import { useIsUserReady, useLanguage, useStep } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  StepSwitcher,
  Translate,
  TurnOrder,
} from 'components';
import { StepAlbum } from './StepAlbum';

function PhasePresentation({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const { step, nextStep } = useStep(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.LINHAS_CRUZADAS.PRESENTATION}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="photo-album"
          title={translate('Álbum de Fotos', 'Album de Fotos')}
          onClose={nextStep}
          currentRound={state?.round?.current}
          unskippable
          duration={7}
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
