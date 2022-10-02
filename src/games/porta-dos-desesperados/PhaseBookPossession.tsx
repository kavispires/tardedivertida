// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useLanguage } from 'hooks/useLanguage';
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { TOTAL_DOORS } from './utils/constants';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TDIcon } from 'components/icons/TDIcon';
import { RoundAnnouncement } from 'components/round';
import { Translate } from 'components/language';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { AvatarName } from 'components/avatars';
import { ViewOr } from 'components/views';

function PhaseBookPossession({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const user = useUser(players);
  const { step, goToNextStep } = useStep();
  const [possessed, isPossessed] = useWhichPlayerIsThe('possessedId', state, players);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.PORTA_DOS_DESESPERADOS.BOOK_POSSESSION}
    >
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
          circleColor="black"
        >
          <Instruction contained>
            <Translate
              pt={
                <>
                  Somos estudantes de feitiçaria presos num corredor de portas tentando voltar pra casa
                  <br />
                  Temos que passar por {TOTAL_DOORS} portas. Estamos na porta no. {state.currentDoor}
                  <br />
                  Será que conseguimos sair antes que nossa mágica acabe? Temos {state.magic} cristais
                  sobrando.
                </>
              }
              en={
                <>
                  We are witchcraft students trapped in a hallway of doors trying to get back home.
                  <br />
                  We have to go through {TOTAL_DOORS} doors. We're at door #{state.currentDoor}
                  <br />
                  Can we get out before our magic is gone? We have {state.magic} magic crystals.
                </>
              }
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<TDIcon />}
          title={translate('O Livro possui um jogador', 'The Book possesses a player')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Cada rodada um jogador é possuído pelo Livro que Tudo Sabe.
                  <br />
                  <AvatarName player={possessed} /> vai escolher cartas que representam as páginas do livro
                  para ajudar os outros jogadores a escolherem a porta correta pra ir para o próximo corredor.
                  <br />
                  Uma armadilha pode aparecer para nos atrapalhar a cada rodada.
                </>
              }
              en={
                <>
                  Each round a player is possessed by The Book Who Knows It All.
                  <br />
                  <AvatarName player={possessed} /> will choose cards representing the pages in the book to
                  try to help the other players choose the correct door to move to the next level.
                  <br />A random trap might show up to disturb our quest.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <ViewOr orCondition={isPossessed}>
          <StepSelectPages />

          <StepWaitPageSelection />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseBookPossession;
