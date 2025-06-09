import { useMemo } from 'react';
// Types
import type { GamePlayers } from 'types/player';
// Icons
import { NuclearExplosionIcon } from 'icons/NuclearExplosionIcon';
import { UnderConstructionIcon } from 'icons/UnderConstructionIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
import { ListOfPlayers } from 'components/players/ListOfPlayers';
import { Instruction, RuleInstruction, TextHighlight } from 'components/text';
// Internal
import { OUTCOME } from '../utils/constants';
import type { Robot } from '../utils/types';
import { EnergyHighlight } from './Highlights';

type FinalOutcomeProps = {
  players: GamePlayers;
  outcome: string;
  robot: Robot;
};

export function FinalOutcome({ players, outcome, robot }: FinalOutcomeProps) {
  const mostSuspicious = useMemo(() => {
    let maxSuspicion = 0;

    return Object.values(players).reduce((acc: PlayerId[], player) => {
      const suspicion = player.suspicion.filter(Boolean).length;
      if (suspicion > maxSuspicion) {
        maxSuspicion = suspicion;
        return [player.id];
      }

      if (suspicion === maxSuspicion) {
        acc.push(player.id);
      }

      return acc;
    }, []);
  }, [players]);

  if (outcome === OUTCOME.HUMANS_WIN) {
    return <></>;
  }

  if (outcome === OUTCOME.ROBOT_WINS) {
    return (
      <TitledContainer
        title={
          <>
            <IconAvatar icon={<NuclearExplosionIcon />} />{' '}
            <Translate pt="Os robôs venceram!" en="Robots win!" />
          </>
        }
      >
        <Instruction contained noMargin>
          <Translate
            en={
              <>
                We have failed to buy our tickets and we powered the robot revolution with{' '}
                <EnergyHighlight>{robot.points}</EnergyHighlight> points and they needed{' '}
                <TextHighlight>{robot.goal}</TextHighlight> points to do so.
              </>
            }
            pt={
              <>
                Falhamos em comprar nossos ingressos e alimentamos a revolução dos robôs com{' '}
                <TextHighlight>{robot.goal}</TextHighlight>pontos e eles precisavam de {robot.goal} pontos
                para fazer isso.
              </>
            }
          />
        </Instruction>
      </TitledContainer>
    );
  }

  if (outcome === OUTCOME.TOO_SUSPICIOUS) {
    return (
      <TitledContainer
        title={
          <>
            <IconAvatar icon={<UnderConstructionIcon />} />{' '}
            <Translate pt="Banidos do servidor!" en="Banned from the server!" />
          </>
        }
      >
        <RuleInstruction type="lore">
          <Translate
            en={<>The players were too suspicions always selecting robot cards! Particularly:</>}
            pt={<>Os jogadores estavam muito suspeitos sempre selecionando cartas de robô! Em particular:</>}
          />
          <br />
          <ListOfPlayers list={mostSuspicious} players={players} prefix="sus" />
        </RuleInstruction>
      </TitledContainer>
    );
  }

  return <></>;
}
