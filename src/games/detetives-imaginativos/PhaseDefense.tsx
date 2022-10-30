// Hooks
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnFinishDefenseRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction, TextHighlight, Title } from 'components/text';
import { Translate } from 'components/language';
import { StepDefending } from './StepDefending';
import { DefenseIcon } from 'components/icons/DefenseIcon';

function PhaseDefense({ state, players, info }: PhaseProps) {
  const { isLoading } = useLoading();
  const { step, goToNextStep } = useStep(0);
  const [currentPlayer, isUserTheCurrentPlayer] = useWhichPlayerIsThe('currentPlayerId', state, players);
  const [, isUserTheImpostor] = useWhichPlayerIsThe('impostorId', state, players);
  const user = useUser(players, state);

  const onFinishDefense = useOnFinishDefenseRequest();

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.DEFENSE}
      className="d-defense-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<DefenseIcon />}
          title={<Translate pt="Defensa" en="Defense" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
        >
          <Title>
            <Translate pt="Pista Secreta era: " en="The Secret Clue was: " />
            <TextHighlight>{state.clue}</TextHighlight>
          </Title>
          <Instruction>
            <Translate
              pt="Agora, cada jogador em ordem deve defender porque escolheu as castas que escolheu."
              en="Now, in turn-order, each player must present the reason they chose their cards."
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepDefending
          clue={state.clue}
          currentPlayer={currentPlayer}
          isUserTheCurrentPlayer={isUserTheCurrentPlayer}
          table={state.table}
          onFinishDefenseClick={onFinishDefense}
          isLoading={isLoading}
          isUserTheImpostor={isUserTheImpostor}
          user={user}
          players={players}
          turnOrder={state.turnOrder}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseDefense;
