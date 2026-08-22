// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';

export function RulesPt() {
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

export function RulesEn() {
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

export function ScoringRules() {
  return (
    <Surface contained>
      <Translate
        pt="Jogadores ganham {exactPoints} se acertarem na mosca!
        <br/>
        Mas {nearPoints} e {farPoints} se votaram 1 ou 2 espaços de distância.
        <br/>
        O Medium ganha {playerPoints} para cada jogador que ganhou ponto (máximo 3 pontos) e se ele(a) chutou a quantidade certa de jogadores que iam acertar, ele ganha mais {bonusPoints}.
        <br/>
        O Medium nunca ganha mais pontos que os outros jogadores."
        en="Players get {exactPoints} if they get it exactly right!
        <br/>
        If one or two spaces away from the needle, they get {nearPoints} and {farPoints} respectively.
        <br/>
        The psychic gets {playerPoints} for every player that got points this turn (maximum of 3 points) and may get {bonusPoints} extra point if they guessed the correct number of player who would get the clue right.
        <br/>
        The psychic may never get more points than the other players."
        values={{
          exactPoints: <PointsHighlight value={4} />,
          nearPoints: <PointsHighlight value={3} />,
          farPoints: <PointsHighlight value={2} />,
          playerPoints: <PointsHighlight value={1} />,
          bonusPoints: <PointsHighlight value={1} />,
        }}
      />
    </Surface>
  );
}
