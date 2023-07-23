// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitOrderingAPIRequest } from './utils/api-requests';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { BarChartIcon } from 'icons/BarChartIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { AvatarName } from 'components/avatars';
import { ViewOr } from 'components/views';
import { StepOrderScenarios } from './StepOrderScenarios';
import { StepJudgeScenarios } from './StepJudgeScenarios';
import { FirstRoundIntroduction } from './components/RulesExplanation';

export function PhaseOrdering({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();
  const [activePlayer, isTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitOrder = useOnSubmitOrderingAPIRequest(setStep);
  const isFirstRound = state.round.current === 1;

  const announcement = (
    <PhaseAnnouncement
      icon={<BarChartIcon />}
      title={<Translate pt="Do melhor para o pior!" en="From best to worst!" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={isFirstRound ? 12 : undefined}
    >
      <Instruction>
        <FirstRoundIntroduction />
        <Translate
          pt={
            <>
              O juiz da rodada é <AvatarName player={activePlayer} addressUser />
            </>
          }
          en={
            <>
              The judge for the round is <AvatarName player={activePlayer} addressUser />
            </>
          }
        />
      </Instruction>

      <TurnOrder players={players} order={state.turnOrder} activePlayerId={activePlayer.id} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.FILEIRA_DE_FATOS.ORDERING}>
      <StepSwitcher step={step} conditions={[!user.isReady]} players={players}>
        {/* Step 0 */}
        <ViewOr condition={isTheActivePlayer}>
          <StepJudgeScenarios
            scenarios={state.scenarios}
            roundType={state.roundType}
            onSubmitOrder={onSubmitOrder}
            announcement={announcement}
          />

          <StepOrderScenarios
            activePlayer={activePlayer}
            scenarios={state.scenarios}
            roundType={state.roundType}
            onSubmitOrder={onSubmitOrder}
            announcement={announcement}
          />
        </ViewOr>

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}
