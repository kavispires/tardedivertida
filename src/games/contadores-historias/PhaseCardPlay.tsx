// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { ImageCardsIcon } from '@icons/ImageCardsIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnPlayCardAPIRequest } from './utils/api-requests';
import { CONTADORES_HISTORIAS_PHASES } from './utils/constants';
import type { PhaseCardPlayState } from './utils/types';
import { StepPlayCard } from './StepPlayCard';

export function PhaseCardPlay({ state, players, user }: PhaseProps<PhaseCardPlayState>) {
  const { step, setStep } = useStep(0);
  const [storyteller, isUserTheStoryTeller] = useWhichPlayerIsThe('storytellerId', state, players);

  const onPlayCard = useOnPlayCardAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<ImageCardsIcon />}
      title={
        <Translate
          pt="Selecione uma carta"
          en="Play a card..."
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Surface>
        <Translate
          pt={
            <>
              Agora, jogadores verão a história da rodada e selecionarão uma de suas cartas que mais se
              aproxime da história. Na próxima fase, se algum outro jogador selecionar sua carta, você ganha{' '}
              <PointsHighlight value={1} />!
            </>
          }
          en={
            <>
              Now players will see the story for the round and select one of their cards that best match the
              story. If any other player vote for your card later, you will get <PointsHighlight value={1} />.
            </>
          }
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={CONTADORES_HISTORIAS_PHASES.CARD_PLAY}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepPlayCard
          players={players}
          user={user}
          story={state.story}
          onPlayCard={onPlayCard}
          storyteller={storyteller}
          isUserTheStoryTeller={isUserTheStoryTeller}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
