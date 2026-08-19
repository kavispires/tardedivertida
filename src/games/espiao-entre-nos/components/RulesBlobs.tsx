// Ant Design Resources
import { Typography } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Utils
import { getPlayerNamesFromIds } from '@utils/helpers';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
// Internal
import type { FinalAssessment } from '../utils/types';

type FinalAssessmentInstructionProps = {
  finalAssessment: FinalAssessment;
  players: GamePlayers;
};

export function FinalAssessmentInstruction({ finalAssessment, players }: FinalAssessmentInstructionProps) {
  const { playerOrder, playerOrderIndex } = finalAssessment;
  const player = players[playerOrder[playerOrderIndex]];

  const playerOrderNames = getPlayerNamesFromIds(playerOrder, players).join(', ');

  return (
    <Surface className="e-phase-instruction">
      <Translate
        en="Since you've failed to find the spy, here's a last resort!"
        pt="Já que vocês falharam em encontrar o espião, há uma última possibilidade!"
      />
      <Typography.Paragraph component="ul">
        <li>
          {playerOrderIndex === 0 ? (
            <Translate
              pt={`Cada jogador, começando por ${player.name}, faz uma acusação.`}
              en={`Each player will, starting with ${player.name}, will make an accusation.`}
            />
          ) : (
            <Translate
              pt={`Agora é a vez de ${player.name} faz uma acusação.`}
              en={`Now it's time for ${player.name} to make an accusation.`}
            />
          )}
        </li>
        <li>
          <Translate
            pt="Se a votação for unânime em qualquer uma das votações, o jogo acaba e revelam-se os papéis."
            en="If the voting result is unanimous, the game is over and the roles are revealed."
          />
        </li>
        <li>
          <Translate
            pt="Sem discussão dessa vez, simplesmente acuse alguém! Não temos mais tempo!"
            en="No discussion, just accuse somebody! There's no time anymore!"
          />
        </li>
        <li>
          <Translate
            pt={`A ordem será essa: ${playerOrderNames}`}
            en={`The order is: ${playerOrderNames}`}
          />
        </li>
      </Typography.Paragraph>
    </Surface>
  );
}
