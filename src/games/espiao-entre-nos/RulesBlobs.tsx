import { Instruction, Translate } from 'components';
import { getPlayersFromIds } from 'utils/helpers';

type FinalAssessmentInstructionProps = {
  finalAssessment: FinalAssessment;
  players: GamePlayers;
};

export function FinalAssessmentInstruction({ finalAssessment, players }: FinalAssessmentInstructionProps) {
  const { playerOrder, playerOrderIndex } = finalAssessment;
  const player = players[playerOrder[playerOrderIndex]];

  const playerOrderNames = getPlayersFromIds(playerOrder, players, true).join(', ');

  return (
    <Instruction className="e-phase-instruction">
      <Translate
        pt={
          <>
            Já que vocês falharam em encontrar o espião, há uma última possibilidade!
            <ul>
              {playerOrderIndex === 0 ? (
                <li>Cada jogador, começando por {player.name}, faz uma acusação.</li>
              ) : (
                <li>Agora é a vez de {player.name} faz uma acusação.</li>
              )}
              <li>
                Se a votação for unânime em qualquer uma das votações, o jogo acaba e revelam-se os papéis.
              </li>
              <li>Sem discussão dessa vez, simplesmente acuse alguém! Não temos mais tempo!</li>
              <li>A ordem será essa: {playerOrderNames}</li>
            </ul>
          </>
        }
        en={
          <>
            Since you've failed to find the spy, here's a last resort!
            <ul>
              {playerOrderIndex === 0 ? (
                <li>Each player will, starting with {player.name}, will make an accusation.</li>
              ) : (
                <li>Now it's time for {player.name} to make an accusation.</li>
              )}
              <li>If the voting result is unanimous, the game is over and the roles are revealed.</li>
              <li>No discussion, just accuse somebody! There's no time anymore!</li>
              <li>The order is: {playerOrderNames}</li>
            </ul>
          </>
        }
      />
    </Instruction>
  );
}
