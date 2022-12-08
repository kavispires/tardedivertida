import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { Instruction } from 'components/text';

export const DrawInstruction = () => (
  <Instruction>
    <Translate
      pt={
        <>
          Você terá <TimeHighlight>10</TimeHighlight> segundos para ler a sua carta e desenhá-la.
          <br />
          Aperte o botão quando estiver pronto!
          <br />
          <strong>Não vale usar números e letras.</strong>
          <br />
          Fique esperto porque o tempo começa assim que você apertar.
        </>
      }
      en={
        <>
          You'll have <TimeHighlight>10</TimeHighlight> seconds to read and draw your card.
          <br />
          Press the button when you're ready!
          <br />
          <strong>You can NOT use numbers or letters.</strong>
          <br />
          Be aware of the timer! It starts as soon as you press the button.
        </>
      }
    />
  </Instruction>
);

export const EvaluationRules = () => (
  <Instruction>
    <Translate
      pt={
        <>
          Encontre os pares de desenho e carta clicando em uma carta ou desenho e em seguida clicando em seu
          par.
          <br />
          Uma bandeirinha aparecerá no topo de cada desenho com a cor e letra da carta que você selecionou.
          <br />
          Quando encontrar todos os pares, envie sua avaliação!
        </>
      }
      en={
        <>
          Find the pairs of artwork and card by clicking on a card or artwork then on its match.
          <br />
          A ribbon will show up on the artwork with the color and letter of the matching card.
          <br />
          When you're done, click the button to send your evaluation!
        </>
      }
    />
  </Instruction>
);

export const GalleryRules = () => (
  <Instruction>
    <Translate
      pt={
        <>
          Agora, mostraremos cada arte, o que os jogadores votaram e a resposta final.
          <br />
          Se você votou na expressão correta, você ganha <PointsHighlight type="positive">
            2
          </PointsHighlight>{' '}
          pontos.
          <br />
          Quando for a sua arte, você ganha <PointsHighlight type="positive">1</PointsHighlight> ponto para
          cada pessoa que votou corretamente.
        </>
      }
      en={
        <>
          Now we show each art, what players voted, and the final answer.
          <br />
          You get <PointsHighlight type="positive">2</PointsHighlight> points if you selected the right card.
          <br />
          When players selected the correct card for your artwork, you get{' '}
          <PointsHighlight type="positive">1</PointsHighlight> point for each match!
        </>
      }
    />
  </Instruction>
);

export const ScoringRules = () => (
  <Instruction>
    <Translate
      pt={
        <>
          Você ganha <PointsHighlight type="positive">2</PointsHighlight> pontos para cada ligação correta
          entre arte e expressão.
          <br />
          Para cada ligação correta que sua arte ganha, você recebe{' '}
          <PointsHighlight type="positive">1</PointsHighlight> ponto.
        </>
      }
      en={
        <>
          You get <PointsHighlight type="positive">2</PointsHighlight> points if you matched the right card
          with artwork.
          <br />
          For you own artwork, you get <PointsHighlight type="positive">1</PointsHighlight> point for each
          correct match the other players done.
        </>
      }
    />
  </Instruction>
);
