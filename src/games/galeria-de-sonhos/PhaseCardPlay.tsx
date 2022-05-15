import { useEffect } from 'react';
// State & Hooks
import { useIsUserReady, useUser, useLanguage, useWhichPlayerIsThe, useStep, useLoading } from 'hooks';
import { useOnPlayCardAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer, PhaseTimerReset } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { Instruction } from 'components/text';

import { CardPlayRules } from './RulesBlobs';
import { StepPlayDream } from './StepPlayDream';
import { StepAnnounceDream } from './StepAnnounceDream';

function PhaseCardPlay({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const { step, goToNextStep, setStep } = useStep();
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);

  const [activePlayer, isActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);
  const [lastActivePlayer] = useWhichPlayerIsThe('lastActivePlayerId', state, players);
  const [playerHavingNightmare] = useWhichPlayerIsThe('playerHavingNightmareId', state, players);

  const onPlayCard = useOnPlayCardAPIRequest(setStep);

  useEffect(() => {
    if (state.turnCount > 0) {
      setStep(3);
    }
  }, [state.turnCount, setStep]);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.GALERIA_DE_SONHOS.CARD_PLAY}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="door-sign"
          title={translate('Hora do Bingo dos Sonhos!', 'Time for the Dream Bingo!')}
          onClose={() => setStep(playerHavingNightmare.id ? 1 : 2)}
          duration={state.round.current < 3 ? 20 : 5}
        >
          <CardPlayRules />
        </PhaseAnnouncement>

        <PhaseTimerReset goToNextStep={goToNextStep} />

        {/* Step 1 */}
        <PhaseAnnouncement
          type="nightmare"
          title={
            <Translate
              pt={
                <>
                  <AvatarName player={playerHavingNightmare} size="large" addressUser /> está em apuros!
                </>
              }
              en={
                <>
                  <AvatarName player={playerHavingNightmare} size="large" addressUser /> is in danger!
                </>
              }
            />
          }
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={state.round.current === 1 ? 10 : 4}
        >
          <Instruction>
            <Translate
              pt="Quando um jogador sozinho selecionou o maior número de sonhos, ele é considerado estar tendo um pesadelo! Se ele não conseguir achar outro jogador que marcou o mesmo sonho para cada uma das cartas selecionadas, ele perde 1 ponto por carta."
              en="When a player alone selected the most dream cards they are considered to be having a nightmare! If they are not able to match every single dream, they will lose 1 point per card."
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <StepPlayDream
          table={state.table}
          word={state.word}
          onPlayCard={onPlayCard}
          user={user}
          activePlayer={activePlayer}
          isActivePlayer={isActivePlayer}
          players={players}
          gameOrder={state.gameOrder}
          isLoading={isLoading}
          goToNextStep={goToNextStep}
        />

        {/* Step 3 */}
        <StepAnnounceDream
          latest={state.latest}
          lastActivePlayer={lastActivePlayer}
          setStep={setStep}
          players={players}
          activePlayer={activePlayer}
          playerHavingNightmare={playerHavingNightmare}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCardPlay;
