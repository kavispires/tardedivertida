import { useEffect, useState } from 'react';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
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
// Icons
import { DoorSignIcon } from 'icons/DoorSignIcon';
import { NightmareIcon } from 'icons/NightmareIcon';
// Components
import { PhaseAnnouncement, PhaseContainer, PhaseTimerReset } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { Instruction } from 'components/text';
import { CardPlayRules } from './components/RulesBlobs';
import { StepPlayDream } from './StepPlayDream';
import { StepAnnounceDream } from './StepAnnounceDream';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { CardHighlight } from 'components/metrics/CardHighlight';

export function PhaseCardPlay({ players, state, info, meta }: PhaseProps) {
  const { isLoading } = useLoading();
  const { step, goToNextStep, setStep } = useStep();
  const user = useUser(players, state);

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
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<DoorSignIcon />}
          title={<Translate pt="Hora do Bingo dos Sonhos!" en="Time for the Dream Bingo!" />}
          onClose={() =>
            setStep(playerInNightmare.id ? GO_TO_PLAYER_WITH_NIGHTMARE_STEP : GO_TO_CARD_PLAY_STEP)
          }
          duration={state.round.current < 2 ? 20 : 5}
          unskippable
          type="block"
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
                  <AvatarName player={playerInNightmare} size="large" addressUser /> entrou em um pesadelo!
                </>
              }
              en={
                <>
                  <AvatarName player={playerInNightmare} size="large" addressUser /> is in nightmare!
                </>
              }
            />
          }
          onClose={() => setStep(GO_TO_CARD_PLAY_STEP)}
          currentRound={state?.round?.current}
          duration={state.round.current < 3 ? 10 : 5}
          unskippable
          type="block"
        >
          <Instruction>
            <Translate
              pt={
                <>
                  <AvatarName player={playerInNightmare} addressUser /> selecionou{' '}
                  <CardHighlight>{Object.keys(playerInNightmare?.cards ?? {}).length} cartas</CardHighlight>,
                  o maior número de cartas da rodada!
                  <br />
                  Se ele não conseguir achar outro jogador que marcou o mesmo sonho para cada uma das cartas
                  selecionadas, ele perde <PointsHighlight type="negative">1</PointsHighlight> ponto por carta
                  que você ganhou ponto.
                  <br />
                </>
              }
              en={
                <>
                  <AvatarName player={playerInNightmare} addressUser /> selected{' '}
                  <CardHighlight>{Object.keys(playerInNightmare?.cards ?? {}).length} cards</CardHighlight>,
                  the largest number of cards for this round!
                  <br />
                  If they are not able to match every single dream, they will lose{' '}
                  <PointsHighlight type="negative">1</PointsHighlight> point per card you previously scored.
                  <br />
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
