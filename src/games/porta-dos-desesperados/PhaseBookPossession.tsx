// State & Hooks
import { useStep } from 'hooks/useStep';
import { useOnSubmitPagesAPIRequest } from './utils/api-requests';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useUser } from 'hooks/useUser';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { shouldAnnounceTrap } from './utils/helpers';
// Icons
import { MagicBookIcon } from 'icons/MagicBookIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer, PhaseTimerReset } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { ViewOr } from 'components/views';
import { TrapAnnouncement } from './components/TrapAnnouncement';
import { RoundOneRule, RoundRule } from './components/RulesBlobs';
import { StepSelectPages } from './StepSelectPages';
import { StepWaitPageSelection } from './StepWaitPageSelection';
import { BookHighlight } from './components/Highlights';
import { TurnOrder } from 'components/players';

function PhaseBookPossession({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep, setStep } = useStep();
  const [possessed, isPossessed] = useWhichPlayerIsThe('possessedId', state, players);

  const onSubmitPages = useOnSubmitPagesAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.PORTA_DOS_DESESPERADOS.BOOK_POSSESSION}
    >
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={state.round.current === 1 ? 20 : 7}
          circleColor={info?.appearance?.color}
          unskippable
        >
          {state.round.current === 1 ? (
            <RoundOneRule magic={state.magic} />
          ) : (
            <RoundRule magic={state.magic} currentCorridor={state.currentCorridor} />
          )}
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<MagicBookIcon />}
          title={<Translate pt="O Livro possui um jogador" en="The Book possesses a player" />}
          onClose={
            shouldAnnounceTrap(state.trap, PHASES.PORTA_DOS_DESESPERADOS.BOOK_POSSESSION)
              ? goToNextStep
              : () => setStep(4)
          }
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Cada rodada um jogador é possuído pelo <BookHighlight>Livro que Tudo Sabe</BookHighlight>.
                  <br />
                  <AvatarName player={possessed} addressUser /> vai escolher cartas que representam as páginas
                  do livro para ajudar os outros jogadores a escolherem a porta correta pra ir para o próximo
                  corredor.
                </>
              }
              en={
                <>
                  Each round a player is possessed by{' '}
                  <BookHighlight>The Book That Knows It All</BookHighlight>.
                  <br />
                  <AvatarName player={possessed} addressUser /> will choose cards representing the pages in
                  the book to try to help the other players choose the correct door to move to the next level.
                </>
              }
            />

            <TurnOrder
              players={players}
              order={state.gameOrder}
              activePlayerId={state.possessedId}
              title={<Translate pt="Ordem da Possessão" en="Possession Order" />}
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <PhaseTimerReset goToNextStep={goToNextStep} />

        {/* Step 3 */}
        <TrapAnnouncement trap={state.trap} goToNextStep={goToNextStep} />

        {/* Step 4 */}
        <ViewOr condition={isPossessed}>
          <StepSelectPages
            pages={state.pages}
            currentCorridor={state.currentCorridor}
            answerDoorId={state.answerDoorId}
            trap={state.trap}
            onSubmitPages={onSubmitPages}
          />

          <StepWaitPageSelection
            players={players}
            currentCorridor={state.currentCorridor}
            trap={state.trap}
            possessed={possessed}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseBookPossession;
