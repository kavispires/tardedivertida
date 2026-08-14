// Types
import type { GamePlayer } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';

type GamePremiseRulesProps = {
  activePlayer: GamePlayer;
};

export function GamePremiseRules({ activePlayer }: GamePremiseRulesProps) {
  return (
    <Surface>
      <Translate
        pt={
          <>
            Precisamos reduzir essa população! Vamos fazer uma pergunta em que todos tem que escrever uma
            certa quantidade de respostas. Você ganha um ponto para cada resposta igual a de outra ovelha.
            Quem receber o menor número de pontos move uma seção para a direita.
            <br />
            Se você já está no último pasto e tiver que mover pra direita, você cai no precipício e morre. O
            pasto fica menos lotado e todos mais felizes.
            <br />
            <Surface contained>
              <PlayerAvatarName
                player={activePlayer}
                addressUser
              />{' '}
              escolherá uma pergunta para essa rodada.
            </Surface>
          </>
        }
        en={
          <>
            We are sheep and our pasture is overcrowded! We need to decide who should leave.
            <br />
            Let's ask a question and everyone has to give a certain number of answers. You are trying to match
            answers with other sheep to get points. Whoever gets the fewest points moves one section to the
            right.
            <br />
            If you are already in the last pasture and have to move to the right, you fall off the cliff and
            die. The pasture is less crowded and everyone is happier.
            <br />
            <Surface contained>
              <PlayerAvatarName
                player={activePlayer}
                addressUser
              />{' '}
              will choose a question for this round.
            </Surface>
          </>
        }
      />
    </Surface>
  );
}

export function AnsweringRules() {
  return (
    <Surface>
      <Translate
        pt={
          <>
            Agora é hora de responder!
            <br />
            Pense em respostas comuns que fará com que você responda igual a outros jogadores.
            <br />
            Você ganha <PointsHighlight value={1} /> para cada uma de suas respostas +{' '}
            <PointsHighlight value={1} /> para cada resposta igual a de outro jogador (1 ponto por jogador).
            <br />
            Por exemplo, se 3 jogadores escreveram 'bola', são <PointsHighlight value={3} /> para cada.
          </>
        }
        en={
          <>
            It's time to answer!
            <br />
            Think of common answers that will help you match the largest number of players.
            <br />
            You get <PointsHighlight value={1} /> for each of your answers + <PointsHighlight value={1} /> for
            each match with other players.
            <br />
            For example, if 3 players write 'chicken', each of those players get <PointsHighlight value={3} />
            .
          </>
        }
      />
    </Surface>
  );
}

export function ComparingRules() {
  return (
    <Surface>
      <Translate
        pt={
          <>
            Hora de comparar respostas!
            <br />O jogo agrupará todas as respostas iguais, mas agora vocês tem a chance de adicionar
            palavras que o jogo não agrupou por conta de erro gramatical, acento ou plural.
            <br />
            Lembre-se gêneros são considerados diferentes <code>príncipe ≠ princesa</code>, assim como geral
            vs específico <code>caminhão ≠ caminhão de mudança</code>.
          </>
        }
        en={
          <>
            Time to compare answers!
            <br />
            The game will group all identical answers, but now the group has a chance to add answers that it
            missed because of typo, accents, or pluralization.
            <br />
            Remember that genders are considered different <code>prince ≠ princess</code>, as well as general
            vs specific <code>truck ≠ fire truck</code>.
          </>
        }
      />
    </Surface>
  );
}
