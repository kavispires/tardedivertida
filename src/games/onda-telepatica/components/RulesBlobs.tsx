// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { PopoverRule } from 'components/rules';
import { Instruction } from 'components/text';

function RulesPt() {
  return (
    <ul>
      <li>
        Use uma única idea. Evite usar "mas", "enquanto", "quando", e também superlativos "super", "muito"
      </li>
      <li>Não invente coisas. Exemplo: 'Nicolas Cage vestido de Nicki Minaj' é inválido.</li>
      <li>Mantenha-se no assunto da carta. Exemplo: 'Amor' não é uma dica válida para 'Sujo'.</li>
      <li>Não use números para sugerir a posição do ponteiro.</li>
      <li>Não use partes, derivados ou sinônimos das palavras da carta.</li>
    </ul>
  );
}

function RulesEn() {
  return (
    <ul>
      <li>
        Use a single idea. Avoid the use of "but", "while", "when", and superlatives like "super", "very",
        etc.
      </li>
      <li>Do not make up things. Example: 'Nicolas Cage dressed up as Nicki Minaj' is invalid.</li>
      <li>Keep it within the theme. Example: 'Love' is not a valid clue for 'Dirty'.</li>
      <li>Don't use number to suggest the position of the needle.</li>
      <li>Don't use parts or synonyms of the words in the cards.</li>
    </ul>
  );
}

export function ClueWritingRules() {
  return (
    <PopoverRule
      content={
        <Translate
          pt={<RulesPt />}
          en={<RulesEn />}
        />
      }
    />
  );
}

export function ScoringRules() {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Jogadores ganham <PointsHighlight>4</PointsHighlight> pontos se acertarem na mosca!
            <br />
            Mas <PointsHighlight>3</PointsHighlight> e <PointsHighlight>2</PointsHighlight> pontos se votaram
            1 ou 2 espaços de distância.
            <br />O Medium ganha <PointsHighlight>1</PointsHighlight> ponto para cada jogador que ganhou ponto
            (máximo 3 pontos) e se ele(a) chutou a quantidade certa de jogadores que iam acertar, ele ganha
            mais <PointsHighlight>1</PointsHighlight> ponto.
            <br />O Medium nunca ganha mais pontos que os outros jogadores.
          </>
        }
        en={
          <>
            Players get <PointsHighlight>4</PointsHighlight> points if they get it exactly right!
            <br />
            If one or two spaces away from the needle, they get <PointsHighlight>3</PointsHighlight> and{' '}
            <PointsHighlight>2</PointsHighlight> points respectively.
            <br />
            The psychic gets <PointsHighlight>1</PointsHighlight> point for every player that got points this
            turn (maximum of 3 points) and may get <PointsHighlight>1</PointsHighlight> extra point if they
            guessed the correct number of player who would get the clue right.
            <br />
            The psychic may never get more points than the other players.
          </>
        }
      />
    </Instruction>
  );
}
