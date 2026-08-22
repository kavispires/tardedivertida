import { useEffect } from 'react';
import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCache } from '@hooks/useCache';
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { MagicBookIcon } from '@icons/MagicBookIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PhaseTimerReset } from '@components/phases/PhaseTimerReset';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { useOnSubmitPagesAPIRequest } from './utils/api-requests';
import { PORTA_DOS_DESESPERADOS_PHASES, TRAPS } from './utils/constants';
import { shouldAnnounceTrap } from './utils/helpers';
import type { DoorsCache, PhaseBookPossessionState } from './utils/types';
import { TrapAnnouncement } from './components/TrapAnnouncement';
import { RoundOneRule, RoundRule } from './components/RulesBlobs';
import { BookHighlight } from './components/Highlights';
import { StepSelectPages } from './StepSelectPages';
import { StepWaitPageSelection } from './StepWaitPageSelection';

export function PhaseBookPossession({ state, players }: PhaseProps<PhaseBookPossessionState>) {
  const { step, goToNextStep, setStep } = useStep();
  const [possessed, isPossessed] = useWhichPlayerIsThe('possessedId', state, players);
  const { setCache } = useCache<DoorsCache>({ doors: [] });

  const onSubmitPages = useOnSubmitPagesAPIRequest(setStep);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Update cache for some traps
  useEffect(() => {
    if (state.trap === TRAPS.ORDERED_DOORS || state.trap === TRAPS.VANISHING_DOORS) {
      setCache({ doors: [] });
    }
  }, [state.trap]);

  const announceTrap = shouldAnnounceTrap(state.trap, PORTA_DOS_DESESPERADOS_PHASES.BOOK_POSSESSION);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={PORTA_DOS_DESESPERADOS_PHASES.BOOK_POSSESSION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={state.round.current === 1 ? 20 : 7}
          unskippable
        >
          {state.round.current === 1 ? (
            <RoundOneRule
              magic={state.magic}
              difficulty={state.difficulty}
            />
          ) : (
            <RoundRule
              magic={state.magic}
              currentCorridor={state.currentCorridor}
            />
          )}
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<MagicBookIcon />}
          title={
            <Translate
              pt="O Livro possui um jogador"
              en="The Book possesses a player"
            />
          }
          onClose={announceTrap ? goToNextStep : () => setStep(4)}
          currentRound={state?.round?.current}
          type="block"
        >
          <Surface>
            <Translate
              pt="Cada rodada um jogador é possuído pelo <book>Livro que Tudo Sabe</book>.
              <br/>
              {player} vai escolher cartas que representam as páginas do livro para ajudar os outros jogadores a escolherem a porta correta pra ir para o próximo corredor."
              en="Each round a player is possessed by <book>The Book That Knows It All</book>.
              <br/>
              {player} will choose cards representing the pages in the book to try to help the other players choose the correct door to move to the next level."
              values={{
                book: (text) => <BookHighlight>{text}</BookHighlight>,
                player: (
                  <PlayerAvatarName
                    player={possessed}
                    addressUser
                  />
                ),
              }}
            />

            <PlayersTurnOrder
              players={players}
              order={state.gameOrder}
              activePlayerId={state.possessedId}
              title={
                <Translate
                  pt="Ordem da Possessão"
                  en="Possession Order"
                />
              }
            />
          </Surface>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <PhaseTimerReset goToNextStep={goToNextStep} />

        {/* Step 3 */}
        <TrapAnnouncement
          trapEntry={state.trapEntry}
          goToNextStep={goToNextStep}
        />

        {/* Step 4 */}
        <Fragment>
          <ViewIf condition={isPossessed}>
            <StepSelectPages
              pages={state.pages}
              currentCorridor={state.currentCorridor}
              answerDoorId={state.answerDoorId}
              trap={state.trap}
              trapEntry={state.trapEntry}
              onSubmitPages={onSubmitPages}
            />
          </ViewIf>
          <ViewIf condition={!isPossessed}>
            <StepWaitPageSelection
              players={players}
              currentCorridor={state.currentCorridor}
              trap={state.trap}
              trapEntry={state.trapEntry}
              possessed={possessed}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
