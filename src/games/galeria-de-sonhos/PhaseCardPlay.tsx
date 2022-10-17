import { useEffect, useState } from 'react';
// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useLanguage } from 'hooks/useLanguage';
import { useStep } from 'hooks/useStep';
import { useLoading } from 'hooks/useLoading';
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
import { DoorSignIcon } from 'components/icons/DoorSignIcon';
import { NightmareIcon } from 'components/icons/NightmareIcon';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

function PhaseCardPlay({ players, state, info, meta }: PhaseProps) {
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
          icon={<DoorSignIcon />}
          title={translate('Hora do Bingo dos Sonhos!', 'Time for the Dream Bingo!')}
          onClose={() =>
            setStep(playerInNightmare.id ? GO_TO_PLAYER_WITH_NIGHTMARE_STEP : GO_TO_CARD_PLAY_STEP)
          }
          duration={state.round.current < 2 ? 20 : 5}
          unskippable
        >
          <CardPlayRules />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <PhaseTimerReset goToNextStep={goToNextStep} />

        {/* Step 2 */}
        <PhaseAnnouncement
          icon={<NightmareIcon />}
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
          duration={state.round.current < 3 ? 10 : 5}
          unskippable
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Quando um jogador sozinho selecionou o maior número de sonhos, ele é considerado estar em um
                  pesadelo!
                  <br />
                  Se ele não conseguir achar outro jogador que marcou o mesmo sonho para cada uma das cartas
                  selecionadas, ele perde <PointsHighlight type="negative">1</PointsHighlight> ponto por carta
                  que você ganhou ponto.
                </>
              }
              en={
                <>
                  When a player alone selected the most dream cards they are considered to be in a nightmare!
                  <br />
                  If they are not able to match every single dream, they will lose{' '}
                  <PointsHighlight type="negative">1</PointsHighlight> point per card you previously scored.
                </>
              }
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
          gameOrder={state.gameOrder}
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
          botEnabled={Boolean(meta?.options?.withBots)}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCardPlay;
