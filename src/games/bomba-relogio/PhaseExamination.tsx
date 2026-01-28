import { sortBy } from 'lodash';
// Types
import type { GameRound, PhaseProps } from 'types/game';
import type { GamePlayer } from 'types/player';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { BuildingIcon } from 'icons/BuildingIcon';
import { BombIcon, BoxBlankIcon } from 'icons/collection';
import { WalkieTalkieIcon } from 'icons/WalkieTalkieIcon';
import { WireIcon } from 'icons/WireIcon';
// Components
import { IconAvatar, PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhaseDeclarationState, PhaseExaminationState } from './utils/types';
import { BOMBA_RELOGIO_PHASES } from './utils/constants';
import { useOnSubmitTargetAPIRequest, useOnUpdateTargetPlayerAPIRequest } from './utils/api-requests';
import { useActivePlayers } from './utils/useActivePlayers';
import { StepExamine } from './StepExamine';

export function PhaseExamination({ players, state, user }: PhaseProps<PhaseExaminationState>) {
  const { step } = useStep();

  const onTarget = useOnSubmitTargetAPIRequest();
  const onUpdate = useOnUpdateTargetPlayerAPIRequest();
  const { currentInvestigator, isTheCurrentInvestigator, previousTargetPlayer } = useActivePlayers(
    state.status,
    players,
  );

  const isFirstInvestigation = Object.values(state.status.cut).length === 0;

  const announcement = getAnnouncement({
    isFirstInvestigation,
    round: state.round,
    status: state.status,
    currentInvestigator,
    previousTargetPlayer,
  });

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={BOMBA_RELOGIO_PHASES.EXAMINATION}
    >
      <StepSwitcher
        step={step}
        players={players}
        conditions={user.hand && user.role}
      >
        {/* Step 0 */}
        <StepExamine
          key={currentInvestigator?.id}
          user={user}
          players={players}
          announcement={announcement}
          dataCounts={state.dataCounts}
          onUpdateTargetPlayerId={onUpdate}
          onTargetCard={onTarget}
          status={state.status}
          round={state.round}
          currentTargetPlayerId={state.currentTargetPlayerId}
          isTheCurrentInvestigator={isTheCurrentInvestigator}
          currentInvestigator={currentInvestigator}
        />
        <div>?</div>
      </StepSwitcher>
    </PhaseContainer>
  );
}

function getAnnouncement({
  isFirstInvestigation,
  round,
  status,
  currentInvestigator,
  previousTargetPlayer,
}: {
  isFirstInvestigation: boolean;
  round: GameRound;
  status: PhaseDeclarationState['status'];
  currentInvestigator: GamePlayer;
  previousTargetPlayer: GamePlayer | null;
}) {
  if (isFirstInvestigation) {
    return (
      <PhaseAnnouncement
        icon={<BuildingIcon />}
        title={
          <Translate
            pt="Encontre os fios vermelhos!"
            en="Find the red wires!"
          />
        }
        currentRound={round.current}
        type="overlay"
        unskippable
        duration={5}
      >
        <Instruction>
          <IconAvatar icon={<WalkieTalkieIcon />} />
          <Translate
            pt={
              <>
                "Todos em seus postos! O que você tem ai, {<PlayerAvatarName player={currentInvestigator} />}
                ?"
              </>
            }
            en={
              <>
                "Everyone to your posts! What do you have there,{' '}
                {<PlayerAvatarName player={currentInvestigator} />}
                ?"
              </>
            }
          />
        </Instruction>
      </PhaseAnnouncement>
    );
  }

  const latestCut = sortBy(Object.keys(status.cut))
    .map((key) => status.cut[key])
    .at(-1);

  if (!latestCut) {
    return null;
  }

  const cardIcon = {
    wire: <WireIcon />,
    blank: <BoxBlankIcon />,
    bomb: <BombIcon />,
  };
  const cardMessage = {
    wire: (
      <Translate
        pt="Um dos fios vermelhos foi encontrado!"
        en="One of the red wires has been found!"
      />
    ),
    blank: (
      <Translate
        pt="Vixi, nada aqui."
        en="Oh no, nothing here."
      />
    ),
    bomb: (
      <Translate
        pt="A bomba foi revelada!"
        en="The bomb has been revealed!"
      />
    ),
  };
  const nextMessage =
    status.outcome === 'CONTINUE' && previousTargetPlayer ? (
      <Translate
        pt={
          <>
            O próximo investigador é <PlayerAvatarName player={previousTargetPlayer} />
          </>
        }
        en={
          <>
            The next investigator is <PlayerAvatarName player={previousTargetPlayer} />
          </>
        }
      />
    ) : (
      <Translate
        pt={<>A rodada chegou ao final, todos, mudem de postos!</>}
        en={<>The round has ended, everyone change positions!</>}
      />
    );

  if (latestCut.type === 'wire' || latestCut.type === 'bomb' || latestCut.type === 'blank') {
    return (
      <PhaseAnnouncement
        icon={cardIcon[latestCut.type]}
        title={cardMessage[latestCut.type]}
        currentRound={round.current}
        type="overlay"
        unskippable
        duration={4}
      >
        <Instruction>
          <IconAvatar icon={<WalkieTalkieIcon />} />
          {nextMessage}
        </Instruction>
      </PhaseAnnouncement>
    );
  }

  return null;
}
