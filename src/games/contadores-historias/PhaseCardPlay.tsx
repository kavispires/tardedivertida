// Hooks
import { useWhichPlayerIsThe, useUser, useLanguage, useStep } from 'hooks';
import { useOnPlayCardAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Instruction, PhaseAnnouncement, PhaseContainer, Step, StepSwitcher, Translate } from 'components';
import { StepPlayCard } from './StepPlayCard';

function PhaseCardPlay({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, nextStep, setStep } = useStep(0);
  const user = useUser(players);
  const [storyteller, isUserTheStoryTeller] = useWhichPlayerIsThe('storytellerId', state, players);

  const onPlayCard = useOnPlayCardAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CONTADORES_HISTORIAS.CARD_PLAY}>
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="image-cards"
          title={translate('Selecione uma carta', 'Play a card...')}
          onClose={nextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Agora, jogadores verão a história da rodada e selecionarão uma de suas cartas que mais se
                  aproxime da história. Na próxima fase, se algum outro jogador selecionar sua carta, você
                  ganha 1 ponto!
                </>
              }
              en={
                <>
                  Now players will see the story for the round and select one of their cards that best match
                  the story. If any other player vote for your card later, you will get 1 point.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <StepPlayCard
            players={players}
            user={user}
            story={state.story}
            onPlayCard={onPlayCard}
            storyteller={storyteller}
            isUserTheStoryTeller={isUserTheStoryTeller}
          />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCardPlay;
