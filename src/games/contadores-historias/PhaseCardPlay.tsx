// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { ImageCardsIcon } from 'icons/ImageCardsIcon';
// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnPlayCardAPIRequest } from './utils/api-requests';
import { CONTADORES_HISTORIAS_PHASES } from './utils/constants';
import { StepPlayCard } from './StepPlayCard';

export function PhaseCardPlay({ state, players, user }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const [storyteller, isUserTheStoryTeller] = useWhichPlayerIsThe('storytellerId', state, players);

  const onPlayCard = useOnPlayCardAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<ImageCardsIcon />}
      title={<Translate pt="Selecione uma carta" en="Play a card..." />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Agora, jogadores verão a história da rodada e selecionarão uma de suas cartas que mais se
              aproxime da história. Na próxima fase, se algum outro jogador selecionar sua carta, você ganha{' '}
              <PointsHighlight>1</PointsHighlight> ponto!
            </>
          }
          en={
            <>
              Now players will see the story for the round and select one of their cards that best match the
              story. If any other player vote for your card later, you will get{' '}
              <PointsHighlight>1</PointsHighlight> point.
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={CONTADORES_HISTORIAS_PHASES.CARD_PLAY}>
      <StepSwitcher step={step} players={players}>
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
