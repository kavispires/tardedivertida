import { useState } from 'react';
// Hooks
import { useWhichPlayerIsThe, useAPICall, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { CONTADORES_HISTORIAS_API } from '../../adapters';
import { PHASES } from '../../utils/phases';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Translate,
  translate,
} from '../../components';
import StepPlayCard from './StepPlayCard';

function PhaseCardPlay({ state, players, info }: PhaseProps) {
  const language = useLanguage();
  const user = useUser(players);
  const [storyteller, isUserTheStoryTeller] = useWhichPlayerIsThe('storytellerId', state, players);
  const [step, setStep] = useState(0);

  const onPlayCard = useAPICall({
    apiFunction: CONTADORES_HISTORIAS_API.submitAction,
    actionName: 'play-card',
    onError: () => setStep(1),
    successMessage: translate('Carta submetida com sucesso', 'Card submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      'Oops, the application found an error while trying to submit your card',
      language
    ),
  });

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CONTADORES_HISTORIAS.CARD_PLAY}>
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="image-cards"
          title={translate('Selecione uma carta', 'Play a card...', language)}
          onClose={() => setStep(1)}
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
