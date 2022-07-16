// Hooks
import { useWhichPlayerIsThe, useUser, useLoading, useLanguage, useStep } from 'hooks';
import { useOnPlayCardAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepPlayCard } from './StepPlayCard';
import { HangingPhotographIcon } from 'components/icons/HangingPhotographIcon';

function PhaseCardPlay({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const { step, goToNextStep } = useStep(0);
  const user = useUser(players);
  const [currentPlayer, isUserTheCurrentPlayer] = useWhichPlayerIsThe('currentPlayerId', state, players);
  const [, isUserTheImpostor] = useWhichPlayerIsThe('impostorId', state, players);

  const onPlayCard = useOnPlayCardAPIRequest();

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.CARD_PLAY}
      className="d-phase d-play-card-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<HangingPhotographIcon />}
          title={translate('Apresentação das Evidências', 'Evidence')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt="Agora, jogadores selecionarão duas cartas, uma de cada vez, como evidência que eles não sao o impostor. Enquanto isso, o impostor está prestando bastante atenção nas cartas selecionadas e escolhendo algo que o(a) ajude a passar despercebido."
              en="Now players will play 2 cards, one at a time, as evidence that they are not the impostor while the impostor is looking closely to what others are playing and trying to go unnoticed."
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepPlayCard
          clue={state.clue}
          currentPlayer={currentPlayer}
          isLoading={isLoading}
          isUserTheImpostor={isUserTheImpostor}
          isUserTheCurrentPlayer={isUserTheCurrentPlayer}
          onPlayCard={onPlayCard}
          players={players}
          table={state.table}
          user={user}
          turnOrder={state.turnOrder}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCardPlay;
