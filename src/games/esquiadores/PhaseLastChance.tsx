// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
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
import { ESQUIADORES_PHASES } from './utils/constants';
import { SnowEffect } from './components/SnowEffect';
import { CurrentBets, CurrentSkierBets } from './components/CurrentBets';
import { StepMakeBets } from './StepMakeBets';
import { StepChoosePlayers } from './StepChoosePlayers';
// Icons

export function PhaseLastChance({ players, state }: PhaseProps<PhaseBetsState>) {
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
      title={<Translate pt="Aposta Final" en="Final Bet" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={5}
    >
      <Instruction>
        <Translate pt="Escolha sua cabana final" en="Choose your final lodge" />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={ESQUIADORES_PHASES.LAST_CHANGE}>
      <SnowEffect />
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: isUserSkier ? (
            <CurrentSkierBets user={user} players={players} />
          ) : (
            <CurrentBets user={user} lodges={state.lodges} betType="final" />
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
            betType="final"
            animateFrom={state.animateFrom}
            animateTo={state.animateTo}
            playerBetType="skiersBoost"
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
            betType="final"
            animateFrom={state.animateFrom}
            animateTo={state.animateTo}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
