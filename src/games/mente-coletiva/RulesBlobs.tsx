import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';

type GamePremiseRulesProps = {
  activePlayer: GamePlayer;
};

export function GamePremiseRules({ activePlayer }: GamePremiseRulesProps) {
  return (
    <Instruction>
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
            <Instruction contained>
              <AvatarName player={activePlayer} /> escolherá uma pergunta para essa rodada.
            </Instruction>
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
            <Instruction contained>
              <AvatarName player={activePlayer} addressUser /> will choose a question for this round.
            </Instruction>
          </>
        }
      />
    </Instruction>
  );
}

export function AnsweringRules() {
  return (
    <Instruction>
      <Translate
        pt={
          <>
            Agora é hora de responder!
            <br />
            Pense em respostas comuns que fará com que você responda igual a outros jogadores.
            <br />
            Você ganha 1 ponto para cada uma de suas respostas + 1 ponto para cada resposta igual a de outro
            jogador (1 ponto por jogador).
            <br />
            Por exemplo, se 3 jogadores escreveram 'bola', são 3 pontos para cada.
          </>
        }
        en={
          <>
            It's time to answer!
            <br />
            Think of common answers that will help you match the largest number of players.
            <br />
            You get 1 point for each of your answers + 1 point for each match with other players.
            <br />
            For example, if 3 players write 'chicken', each of those players get 3 points.
          </>
        }
      />
    </Instruction>
  );
}

export function ComparingRules() {
  return (
    <Instruction>
      <Translate
        pt={
          <>
            Hora de comparar respostas!
            <br />
            O jogo agrupará todas as respostas iguais, mas agora vocês tem a chance de adicionar palavras que
            o jogo não agrupou por conta de erro gramatical, acento ou plural.
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
    </Instruction>
  );
}
