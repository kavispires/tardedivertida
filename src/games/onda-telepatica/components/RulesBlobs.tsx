import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Instruction } from 'components/text';

function RulesPt() {
  return (
    <ul>
      <li>
        Use uma única idea. Evite usar "mas", "enquanto", "quando", e também superlativos "super", "muito"
      </li>
      <li>Não invente coisas. Exemplo: 'Nicolas Cage cantando uma música dos Beatles' é inválido.</li>
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
      <li>Do not make up things. Example: 'Nicolas Cage singing the Beatles' is invalid.</li>
      <li>Keep it within the theme. Example: 'Love' is not a valid clue for 'Dirty'.</li>
      <li>Don't use number to suggest the position of the needle.</li>
      <li>Don't use parts or synonyms of the words in the cards.</li>
    </ul>
  );
}

export function ClueWritingRules() {
  return <PopoverRule content={<Translate pt={<RulesPt />} en={<RulesEn />} />} />;
}

export function ScoringRules() {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Jogadores ganham 4 pontos se acertarem na mosca!
            <br />
            Mas 3 e 2 pontos se votaram 1 ou 2 espaços de distância.
            <br />O Medium ganha 1 ponto para cada jogador que ganhou ponto (máximo 3 pontos) e se ele(a)
            chutou a quantidade certa de jogadores que iam acertar, ele ganha mais 1 ponto.
            <br />O Medium nunca ganha mais pontos que os jogadores.
          </>
        }
        en={
          <>
            Players get 4 points if they get it exactly right!
            <br />
            If one or two spaces away from the needle, they get 3 and 2 points respectively.
            <br />
            The psychic gets 1 point for every player that got points this turn (maximum of 3 points) and may
            get 1 extra point if they guessed the correct number of player who would get the clue right.
            <br />
            The psychic may never get more points than the players.
          </>
        }
      />
    </Instruction>
  );
}
