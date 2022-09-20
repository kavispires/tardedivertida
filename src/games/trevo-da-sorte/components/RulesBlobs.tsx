// Utils
import { FIRST_ATTEMPT_SCORE, SECOND_ATTEMPT_SCORE } from '../utils/constants';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';

export function WritingRules() {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Escreva uma dica (palavra única) que conecte cada um dos pares de palavras na parte de fora do
            trevo.
            <br />
            Você pode girar o trevo para ficar mais fácil de escrever usando os controles na parte inferior.
            <br />
            Se o par de palavras estiver muito difícil, você pode girar as cartas brancas, mas cuidado para
            não avacalhar dicas que você já escreveu.
          </>
        }
        en={
          <>
            Write a single-word clue that connects each pair of words in the outer side of the clover.
            <br />
            You may rotate the clover when writing using the buttons in the bottom part of the clover
            container.
            <br />
            If the pair of words is too difficult, you may rotate the cards but pay attention on how it will
            change the other pairs when doing so.
          </>
        }
      />
    </Instruction>
  );
}

export function GuessingRules() {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Posicione as cartas no trevo de acordo com as dicas.
            <br />
            Somente 4 das cartas serão usadas e elas podem estar em qualquer orientação.
            <br />
            Clique nas palavras de uma das cartas para pegá-la e então no quadrante do trevo para
            posicioná-la.
            <br />
            Você tem duas chances para adivinhar. Quando apertar Enviar pela primeira vez, o jogo manterá
            todas as cartas corretas (te dando {FIRST_ATTEMPT_SCORE} pontos) e então você tera uma segunda
            chance de acertar (ganhando {SECOND_ATTEMPT_SCORE} ponto por cada)
          </>
        }
        en={
          <>
            Place the cards below inside the clover according to giving clues.
            <br />
            Only 4 of the cards will be used and they can be in any orientation.
            <br />
            Click on the card words to grab it then on the clover quadrant you want to place it.
            <br />
            You have two chances to guess. When you press the first time the game will validate and keep your
            correct answers (granting you {FIRST_ATTEMPT_SCORE} points) and then you have a second chance to
            guess the remainder for {SECOND_ATTEMPT_SCORE} point each.
          </>
        }
      />
    </Instruction>
  );
}
