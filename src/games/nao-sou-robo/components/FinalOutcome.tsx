import { IconAvatar } from 'components/avatars';
import { Container } from 'components/general/Container';
import { Translate } from 'components/language';
import { ListOfPlayers } from 'components/players/ListOfPlayers';
import { Instruction, TextHighlight } from 'components/text';
import { NuclearExplosionIcon } from 'icons/NuclearExplosionIcon';
import { UnderConstructionIcon } from 'icons/UnderConstructionIcon';
import { useMemo } from 'react';
import { GamePlayers } from 'types/player';

import { OUTCOME } from '../utils/constants';
import { Robot } from '../utils/types';
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
      <Container
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
      </Container>
    );
  }

  if (outcome === OUTCOME.TOO_SUSPICIOUS) {
    return (
      <Container
        title={
          <>
            <IconAvatar icon={<UnderConstructionIcon />} />{' '}
            <Translate pt="Banido do servidor!" en="Banned from the server!" />
          </>
        }
      >
        <Instruction contained noMargin>
          <Translate
            en={<>The players were too suspicions always selecting robot cards! Particularly:</>}
            pt={<>Os jogadores estavam muito suspeitos sempre selecionando cartas de robô! Em particular:</>}
          />
          <br />
          <ListOfPlayers list={mostSuspicious} players={players} prefix="sus" />
        </Instruction>
      </Container>
    );
  }

  return <></>;
}
