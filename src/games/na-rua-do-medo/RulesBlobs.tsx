// Components
import { Instruction, Translate } from '../../components';
import { CandyCount } from './CandyCount';

type DecisionExplanationProps = {
  user: GamePlayer;
  totalCandyInSidewalk: number;
};

export function DecisionExplanation({ user, totalCandyInSidewalk }: DecisionExplanationProps) {
  const isThereAnyCandy = Boolean(user.hand + totalCandyInSidewalk);

  return (
    <Instruction contained>
      {isThereAnyCandy ? (
        <Translate
          pt={
            <>
              Se você voltar pra sua casa você come todos os doces em mãos{' '}
              <CandyCount candyCount={user.hand} /> e divide os doces ainda na rua{' '}
              <CandyCount candyCount={totalCandyInSidewalk} /> com os jogadores que também decidirem voltar.
            </>
          }
          en={
            <>
              If you go back home you cash in all your candy in hand <CandyCount candyCount={user.hand} /> and
              divide all candy still in the street <CandyCount candyCount={totalCandyInSidewalk} /> with other
              players who also decide to go back.
            </>
          }
        />
      ) : (
        <Translate
          pt="Não tem doce nenhum ainda, então, melhor simplesmente continuar!"
          en="There's no candy yet, so why not just continue?"
        />
      )}
      <br />

      <Translate
        pt="Lembre-se que se dois monstros iguais aparecerem, todos entram em pânico, derrubam todos os doces em mãos e correm pra casa."
        en="Remember that if two of the same monster show up, you lose all candy in hand because you freaked out, dropped everything, and ran home."
      />
    </Instruction>
  );
}

export function CardCountExplanation() {
  return (
    <Translate
      pt={
        <>
          O baralho de cartas contém 21 cartas Gostosuras que variam de 1 a 19 doces.
          <br />
          Também contém 5 tipos de monstros com 3 cartas para cada.
          <br />
          Cada vez que um monstro aparece duas vezes e causa pânico, uma de suas cartas é removida do baralho.
          <br />
          Cada rua adiciona um iPad indivisível, somente uma pessoa pode tê-lo, se ninguém conseguir pegar o
          iPad a rua, ele fica no baralho para a próxima rodada.
        </>
      }
      en={
        <>
          The deck has 21 Candy cards varying from 1 to 19 candies.
          <br />
          It also has 5 types of monsters with 3 cards each.
          <br />
          When a second monster of the same type shows up, one of its cards is remove for the next round.
          <br />
          Each street adds an unshareable iPad, only one person get get it, if nobody has gotten the iPad on
          the current street, it will remain in the deck for the next round.
        </>
      }
    />
  );
}
