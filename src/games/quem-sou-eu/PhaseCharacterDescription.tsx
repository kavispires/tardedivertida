// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { PlayerIconsIcon } from 'icons/PlayerIconsIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { RoundAnnouncement } from 'components/round/RoundAnnouncement';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
// Internal
import { useOnSubmitGlyphsAPIRequest } from './utils/api-requests';
import { QUEM_SOU_EU_PHASES } from './utils/constants';
import type { PhaseCharacterDescriptionState } from './utils/types';
import { WaitingRoomCharacter } from './components/WaitingRoomCharacter';
import { StepSelectGlyphs } from './StepSelectGlyphs';

export function PhaseCharacterDescription({
  state,
  players,
  user,
}: PhaseProps<PhaseCharacterDescriptionState>) {
  const { step, goToNextStep, setStep } = useStep();

  const onSelectGlyphs = useOnSubmitGlyphsAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<PlayerIconsIcon />}
      title={
        <Translate
          pt="Descreva seu personagem com ícones"
          en="Describe your character with glyphs"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={<>Selecione até 6 ícones que ajudem os outros jogadores a adivinhar o seu personagem</>}
          en={<>Select up to 6 glyphs that would help other players to guess who your character is</>}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={QUEM_SOU_EU_PHASES.CHARACTER_DESCRIPTION}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: <WaitingRoomCharacter user={user} />,
        }}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
        />

        {/* Step 0 */}
        <StepSelectGlyphs
          user={user}
          onSelectGlyphs={onSelectGlyphs}
          characters={state.characters}
          tableOrder={state.tableOrder}
          announcement={announcement}
          roundType={state.roundType}
          imageCardMode={state.mode === 'imageCards'}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
