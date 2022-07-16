// Hooks
import { useWhichPlayerIsThe, useLanguage, useStep } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepReveal } from './StepReveal';
import { RankIcon } from 'components/icons/RankIcon';

function PhaseReveal({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep } = useStep(0);
  const [impostor] = useWhichPlayerIsThe('impostorId', state, players);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.REVEAL}
      className="d-voting-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<RankIcon />}
          title={translate('Revelação', 'Reveal')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Se o impostor recebeu 2 ou mais votos ele(a) é desmascarado. Quem votou nele ganha 3 pontos.
                  <br />
                  Se o impostor recebeu menos de 2 votos, ele ganha 5 pontos e o detetive líder ganha 4
                  pontos.
                </>
              }
              en={
                <>
                  If the impostor gets 2 or more votes, they are exposed. Whoever voted for him get 3 points.
                  <br />
                  If the impostor gets fewer than 2 votes, he gets 5 points and the Lead detective gets 4
                  points.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepReveal
          impostor={impostor}
          impostorVotes={state.impostorVotes}
          players={players}
          leaderId={state.leaderId}
          round={state.round}
          ranking={state.ranking}
          lastRound={state.lastRound}
          table={state.table}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReveal;
