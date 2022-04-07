// State & Hooks
import { useIsUserReady, useLanguage, useStep } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { TurnOrder } from 'components/players';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { StepSwitcher } from 'components/steps';
import { StepAlbum } from './StepAlbum';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

function PhasePresentation({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const { step, goToNextStep } = useStep(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.LINHAS_CRUZADAS.PRESENTATION}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="photo-album"
          title={translate('Álbum de Fotos', 'Album de Fotos')}
          onClose={goToNextStep}
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
