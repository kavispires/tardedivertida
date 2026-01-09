// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { HangingPhotographIcon } from 'icons/HangingPhotographIcon';
// Components
import { Translate } from 'components/language';
import { CardHighlight } from 'components/metrics/CardHighlight';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnPlayCardAPIRequest } from './utils/api-requests';
import { DETETIVES_IMAGINATIVOS_PHASES } from './utils/constants';
import type { PhaseCardPlayState } from './utils/types';
import { StepPlayCard } from './StepPlayCard';

export function PhaseCardPlay({ state, players, user }: PhaseProps<PhaseCardPlayState>) {
  const { isLoading } = useLoading();
  const { step } = useStep(0);
  const [currentPlayer, isUserTheCurrentPlayer] = useWhichPlayerIsThe('currentPlayerId', state, players);
  const [, isUserTheImpostor] = useWhichPlayerIsThe('impostorId', state, players);

  const onPlayCard = useOnPlayCardAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<HangingPhotographIcon />}
      title={
        <Translate
          pt="Apresentação das Evidências"
          en="Evidence"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Agora, jogadores selecionarão <CardHighlight>2</CardHighlight> cartas, uma de cada vez, como
              evidência que eles não são o impostor. Enquanto isso, o impostor está prestando bastante atenção
              nas cartas selecionadas e escolhendo algo que o(a) ajude a passar despercebido.
            </>
          }
          en={
            <>
              Now players will play <CardHighlight>2</CardHighlight> cards, one at a time, as evidence that
              they are not the impostor while the impostor is looking closely to what others are playing and
              trying to go unnoticed.
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={DETETIVES_IMAGINATIVOS_PHASES.CARD_PLAY}
      className="d-phase d-play-card-phase"
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepPlayCard
          clue={state.clue}
          currentPlayer={currentPlayer}
          isLoading={isLoading}
          isUserTheImpostor={isUserTheImpostor}
          onPlayCard={onPlayCard}
          isUserTheCurrentPlayer={isUserTheCurrentPlayer}
          players={players}
          table={state.table}
          user={user}
          turnOrder={state.turnOrder}
          announcement={announcement}
          leaderId={state.leaderId}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
