// Types
import type { GamePlayer } from 'types/game';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { RulesList } from '@components/rules/RulesList';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import { CandyHighlight } from './Highlights';

const CANDY_VALUES = [1, 2, 3, 4, 5, 5, 5, 7, 7, 7, 8, 9, 10, 11, 11, 12, 13, 14, 15, 17, 19];

type DecisionExplanationProps = {
  user: GamePlayer;
  totalCandyInSidewalk: number;
};

export function DecisionExplanation({ user, totalCandyInSidewalk }: DecisionExplanationProps) {
  const isThereAnyCandy = Boolean(user.hand + totalCandyInSidewalk);

  return (
    <RuleInstruction type={user.ready ? 'wait' : 'action'}>
      {isThereAnyCandy ? (
        <Translate
          pt="Se você voltar pra sua casa você come todos os doces em mãos {hand} e divide os doces ainda na rua {street} com os jogadores que também decidirem voltar."
          en="If you go back home you cash in all your candy in hand {hand} and divide all candy still in the street {street} with other players who also decide to go back."
          values={{
            hand: <CandyHighlight>{user.hand}</CandyHighlight>,
            street: <CandyHighlight>{totalCandyInSidewalk}</CandyHighlight>,
          }}
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
    </RuleInstruction>
  );
}

export function CardCountExplanation() {
  const { language } = useLanguage();

  return (
    <Surface>
      <RulesList>
        {language === 'pt' ? (
          <>
            <li>
              O baralho de cartas contém {CANDY_VALUES.length} cartas Gostosuras que variam de 1 a 19 doces.
              <br />({CANDY_VALUES.join(', ')})
            </li>
            <li>Também contém 5 tipos de monstros com 3 cartas para cada (Total: 15).</li>
            <li>
              Cada vez que um monstro aparece duas vezes e causa pânico, uma de suas cartas é removida do
              baralho.
            </li>
            <li>
              Cada rua adiciona um iPad indivisível ao baralho, somente uma pessoa pode tê-lo, se ninguém
              conseguir pegar o iPad a rua, ele fica no baralho para a próxima rodada.
            </li>
          </>
        ) : (
          <>
            <li>
              The deck has {CANDY_VALUES.length} Candy cards varying from 1 to 19 candies.
              <br />({CANDY_VALUES.join(', ')})
            </li>
            <li>It also has 5 types of monsters with 3 cards each (15 total).</li>
            <li>
              When a second monster of the same type shows up, one of its cards is remove for the next round.
            </li>
            <li>
              Each street adds an unshareable iPad to the deck, only one person get get it, if nobody has
              gotten the iPad on the current street, it will remain in the deck for the next round.
            </li>
          </>
        )}
      </RulesList>
    </Surface>
  );
}
