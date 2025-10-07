// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { DefenseIcon } from 'icons/DefenseIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnFinishDefenseRequest } from './utils/api-requests';
import { DETETIVES_IMAGINATIVOS_PHASES } from './utils/constants';
import type { PhaseDefenseState } from './utils/types';
import { RevealedClueTitle } from './components/Titles';
import { StepDefending } from './StepDefending';

export function PhaseDefense({ state, players, user }: PhaseProps<PhaseDefenseState>) {
  const { isLoading } = useLoading();
  const { step } = useStep(0);
  const [currentPlayer, isUserTheCurrentPlayer] = useWhichPlayerIsThe('currentPlayerId', state, players);
  const [, isUserTheImpostor] = useWhichPlayerIsThe('impostorId', state, players);

  const onFinishDefense = useOnFinishDefenseRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<DefenseIcon />}
      title={<Translate pt="Defensa" en="Defense" />}
      currentRound={state?.round?.current}
      duration={5}
      type="overlay"
    >
      <Flex className="d-secret-clue-announcement" justify="center" align="center" gap={8}>
        <RevealedClueTitle clue={state.clue} />
      </Flex>

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
      allowedPhase={DETETIVES_IMAGINATIVOS_PHASES.DEFENSE}
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
