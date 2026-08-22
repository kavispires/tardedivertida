import clsx from 'clsx';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { TimeHighlight } from '@components/metrics/TimeHighlight';

export const DrawInstruction = () => (
  <Surface>
    <Translate
      en="You have <time>10 seconds</time> to read and draw your card. Press the button when you're ready!
      <br/>
      <tada>You can NOT use numbers or letters.</tada>
      <br/>
      Be aware of the timer! It starts as soon as you press the button."
      pt="Você terá <time>10 segundos</time> para ler a sua carta e desenhá-la. Aperte o botão quando estiver pronto!
      <br/>
      <tada>Não vale usar números e letras.</tada>
      <br/>
      Fique esperto porque o tempo começa assim que você apertar."
      values={{
        time: (content) => <TimeHighlight>{content}</TimeHighlight>,
        tada: (content) => (
          <span className={clsx(getAnimationClass('tada'))}>
            <strong>{content}</strong>
          </span>
        ),
      }}
    />
  </Surface>
);

export const EvaluationRules = () => (
  <Surface>
    <Translate
      pt="Encontre os pares de desenho e carta clicando em uma carta ou desenho e em seguida clicando em seu par.
      <br/>
      Uma bandeirinha aparecerá no topo de cada desenho com a cor e letra da carta que você selecionou.
      <br/>
      Quando encontrar todos os pares, envie sua avaliação!"
      en="Find the pairs of artwork and card by clicking on a card or artwork then on its match.
      <br/>
      A ribbon will show up on the artwork with the color and letter of the matching card.
      <br/>
      When you're done, click the button to send your evaluation!"
    />
  </Surface>
);

export const GalleryRules = () => (
  <Surface>
    <Translate
      en="Now we show each art, what players voted, and the final answer.
      <br/>
      You get <points>2</points> if you paired the correct card and art.
      <br/>
      When players selected the correct card for your artwork, you get <bonus>1 point</bonus> for each match!"
      pt="Agora, mostraremos cada arte, o que os jogadores votaram e a resposta final.
      <br/>
      Se você votou na expressão correta, você ganha <points>2</points>.
      <br/>
      Quando for a sua arte, você ganha <bonus>1</bonus> para cada pessoa que votou corretamente."
      values={{
        points: () => (
          <PointsHighlight
            type="positive"
            value={2}
          />
        ),
        bonus: () => (
          <PointsHighlight
            type="positive"
            value={1}
          />
        ),
      }}
    />
  </Surface>
);

export const ScoringRules = () => (
  <Surface>
    <Translate
      en="You get <points>2</points> points if you matched the right card with artwork.
      <br/>
      For you own artwork, you get <bonus>1</bonus> point for each correct match the other players done."
      pt="Você ganha <points>2</points> pontos se você combinou a carta correta com a arte.
      <br/>
      Para sua própria arte, você ganha <bonus>1</bonus> ponto para cada combinação correta que os outros jogadores fizeram."
      values={{
        points: () => (
          <PointsHighlight
            type="positive"
            value={2}
          />
        ),
        bonus: () => (
          <PointsHighlight
            type="positive"
            value={1}
          />
        ),
      }}
    />
  </Surface>
);
