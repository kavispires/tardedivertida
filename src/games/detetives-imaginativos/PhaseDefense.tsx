// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { DefenseIcon } from 'icons/DefenseIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction, TextHighlight, Title } from 'components/text';
// Internal
import { useOnFinishDefenseRequest } from './utils/api-requests';
import { StepDefending } from './StepDefending';

export function PhaseDefense({ state, players }: PhaseProps) {
  const { isLoading } = useLoading();
  const { step } = useStep(0);
  const [currentPlayer, isUserTheCurrentPlayer] = useWhichPlayerIsThe('currentPlayerId', state, players);
  const [, isUserTheImpostor] = useWhichPlayerIsThe('impostorId', state, players);
  const user = useUser(players, state);

  const onFinishDefense = useOnFinishDefenseRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<DefenseIcon />}
      title={<Translate pt="Defensa" en="Defense" />}
      currentRound={state?.round?.current}
      duration={5}
      type="overlay"
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
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.DEFENSE}
      className="d-defense-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
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
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
