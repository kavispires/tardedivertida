// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { GamblingChipIcon } from 'icons/GamblingChipIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import type { PhaseBetsState } from './utils/types';
import { useOnSubmitBetsAPIRequest } from './utils/api-requests';
import { SnowEffect } from './components/SnowEffect';
import { CurrentBets, CurrentSkierBets } from './components/CurrentBets';
import { StepMakeBets } from './StepMakeBets';
import { StepChoosePlayers } from './StepChoosePlayers';
// Icons

export function PhaseBoost({ players, state }: PhaseProps<PhaseBetsState>) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();
  const [skier, isUserSkier] = useWhichPlayerIsThe('activeSkierId', state, players);

  const onSubmitBets = useOnSubmitBetsAPIRequest(setStep);

  const announcement = isUserSkier ? (
    <PhaseAnnouncement
      icon={<GamblingChipIcon />}
      title={<Translate pt="Aposte nos jogadores" en="Bet on the players" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={5}
    ></PhaseAnnouncement>
  ) : (
    <PhaseAnnouncement
      icon={<GamblingChipIcon />}
      title={<Translate pt="Apostas Bônus" en="Boost Bets" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={5}
    >
      <Instruction>
        <Translate
          pt="Distribua seus pontos bônus de acordo com o que o esquiador"
          en="Distribute your boost points according to skier"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.ESQUIADORES.BOOSTS}>
      <SnowEffect />
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: isUserSkier ? (
            <CurrentSkierBets user={user} players={players} />
          ) : (
            <CurrentBets user={user} lodges={state.lodges} betType="boost" />
          ),
        }}
      >
        {/* Step 1 */}
        <ViewOr condition={isUserSkier}>
          <StepChoosePlayers
            announcement={announcement}
            players={players}
            turnOrder={state.turnOrder}
            user={user}
            skier={skier}
            mountain={state.mountain}
            lodges={state.lodges}
            onSubmitBets={onSubmitBets}
            betType="boost"
            animateFrom={state.animateFrom}
            animateTo={state.animateTo}
            playerBetType="skiersBets"
          />

          <StepMakeBets
            announcement={announcement}
            players={players}
            turnOrder={state.turnOrder}
            user={user}
            skier={skier}
            mountain={state.mountain}
            lodges={state.lodges}
            onSubmitBets={onSubmitBets}
            betType="boost"
            animateFrom={state.animateFrom}
            animateTo={state.animateTo}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
