// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { useOnSubmitGlyphsAPIRequest } from './utils/api-requests';
// Icons
import { PlayerIconsIcon } from 'icons/PlayerIconsIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepSelectGlyphs } from './StepSelectGlyphs';
import { RoundAnnouncement } from 'components/round';
import { WaitingRoomCharacter } from './components/WaitingRoomCharacter';

export function PhaseCharacterDescription({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep, setStep } = useStep();

  const onSelectGlyphs = useOnSubmitGlyphsAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<PlayerIconsIcon />}
      title={<Translate pt="Descreva seu personagem com ícones" en="Describe your character with glyphs" />}
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.QUEM_SOU_EU.CHARACTER_DESCRIPTION}>
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
          circleColor={info?.appearance?.color}
        ></RoundAnnouncement>

        {/* Step 0 */}
        <StepSelectGlyphs
          user={user}
          onSelectGlyphs={onSelectGlyphs}
          characters={state.characters}
          tableOrder={state.tableOrder}
          announcement={announcement}
          roundType={state.roundType}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
