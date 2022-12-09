// Hooks
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnPlayCardAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { NOOP } from 'utils/constants';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepPlayCard } from './StepPlayCard';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { ImageCardsIcon } from 'components/icons/ImageCardsIcon';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

function PhaseCardPlay({ state, players, info }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const user = useUser(players, state);
  const [storyteller, isUserTheStoryTeller] = useWhichPlayerIsThe('storytellerId', state, players);

  const onPlayCard = useOnPlayCardAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<ImageCardsIcon />}
      title={<Translate pt="Selecione uma carta" en="Play a card..." />}
      onClose={NOOP}
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CONTADORES_HISTORIAS.CARD_PLAY}>
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

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCardPlay;
