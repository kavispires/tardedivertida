// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { LawIcon } from 'icons/LawIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { StepSelectPlayer } from 'components/steps/StepSelectPlayer';
// Internal
import { useOnSubmitPlayersRolesAPIRequest } from './utils/api-requests';
import { FOFOCA_QUENTE_PHASES } from './utils/constants';

export function PhaseRolesSelection({ state, players }: PhaseProps) {
  const { step, setStep } = useStep();

  const onSubmitPlayersRoles = useOnSubmitPlayersRolesAPIRequest(setStep);

  const onSubmitPlayers = (gossiperPlayerId: string) => {
    const detectivePlayerId =
      Object.values(players).find((player) => player.id !== gossiperPlayerId)?.id ?? '';

    onSubmitPlayersRoles({ gossiperPlayerId, detectivePlayerId });
  };

  const announcement = (
    <PhaseAnnouncement
      icon={<LawIcon />}
      title={
        <Translate
          pt="Quem quer ser o fofoqueiro?"
          en="Who will be the gossiper?"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    />
  );

  const title = (
    <Translate
      pt="Quem quer ser o fofoqueiro?"
      en="Who will be the gossiper?"
    />
  );

  const ruleInstruction = (
    <Translate
      en={
        <>
          The gossiper will have to intimidate students and spread rumors about them while the detective tries
          to figure out who the gossiper is.
        </>
      }
      pt={
        <>
          O fofoqueiro terá que intimidar estudantes e espalhar rumores sobre eles enquanto o detetive tenta
          descobrir quem é o fofoqueiro.
        </>
      }
    />
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={FOFOCA_QUENTE_PHASES.ROLES_SELECTION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepSelectPlayer
          players={players}
          announcement={announcement}
          titleProps={{
            children: <>{title}</>,
            size: 'small',
          }}
          ruleInstructionProps={{
            children: <>{ruleInstruction}</>,
            type: 'lore',
          }}
          onSubmitPlayer={onSubmitPlayers}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
