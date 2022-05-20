import { useEffect, useState } from 'react';
// State & Hooks
import { useIsUserReady, useUser, useLanguage, useWhichPlayerIsThe, useStep, useLoading } from 'hooks';
import { useOnPlayCardAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import {
  GO_TO_CARD_PLAY_STEP,
  GO_TO_PLAYER_WITH_NIGHTMARE_STEP,
  GO_TO_SEE_CARD_STEP,
} from './utils/constants';
// Components
import { PhaseAnnouncement, PhaseContainer, PhaseTimerReset } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { Instruction } from 'components/text';
import { CardPlayRules } from './components/RulesBlobs';
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
  const [playerInNightmare] = useWhichPlayerIsThe('playerInNightmareId', state, players);

  const [lastTurnCount, setLastTurnCount] = useState('');

  const onPlayCard = useOnPlayCardAPIRequest(setStep);

  useEffect(() => {
    if (lastTurnCount && state.turnCount !== lastTurnCount) {
      setStep(GO_TO_SEE_CARD_STEP);
    }
  }, [state.turnCount]); // eslint-disable-line

  useEffect(() => {
    if (!state.activePlayerId) {
      setStep(GO_TO_SEE_CARD_STEP);
    }
  }, [state.activePlayerId, setStep]);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.GALERIA_DE_SONHOS.CARD_PLAY}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="door-sign"
          title={translate('Hora do Bingo dos Sonhos!', 'Time for the Dream Bingo!')}
          onClose={() =>
            setStep(playerInNightmare.id ? GO_TO_PLAYER_WITH_NIGHTMARE_STEP : GO_TO_CARD_PLAY_STEP)
          }
          duration={state.round.current < 3 ? 20 : 5}
        >
          <CardPlayRules />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <PhaseTimerReset goToNextStep={goToNextStep} />

        {/* Step 2 */}
        <PhaseAnnouncement
          type="nightmare"
          animationType="tada"
          title={
            <Translate
              pt={
                <>
                  <AvatarName player={playerInNightmare} size="large" addressUser /> está em apuros!
                </>
              }
              en={
                <>
                  <AvatarName player={playerInNightmare} size="large" addressUser /> is in danger!
                </>
              }
            />
          }
          onClose={() => setStep(GO_TO_CARD_PLAY_STEP)}
          currentRound={state?.round?.current}
          duration={state.turnCount < 1 ? 10 : 3}
        >
          <Instruction>
            <Translate
              pt="Quando um jogador sozinho selecionou o maior número de sonhos, ele é considerado estar em um pesadelo! Se ele não conseguir achar outro jogador que marcou o mesmo sonho para cada uma das cartas selecionadas, ele perde 1 ponto por carta."
              en="When a player alone selected the most dream cards they are considered to be in a nightmare! If they are not able to match every single dream, they will lose 1 point per card."
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 3 */}
        <PhaseTimerReset goToNextStep={goToNextStep} />

        {/* Step 4 */}
        <StepAnnounceDream
          latest={state.latest}
          lastActivePlayer={lastActivePlayer}
          setStep={setStep}
          players={players}
          activePlayer={activePlayer}
          playerInNightmare={playerInNightmare}
        />

        {/* Step 5 */}
        <PhaseTimerReset goToNextStep={goToNextStep} />

        {/* Step 6 */}
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
          setLastTurnCount={setLastTurnCount}
          playerInNightmareId={state.playerInNightmareId}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCardPlay;
