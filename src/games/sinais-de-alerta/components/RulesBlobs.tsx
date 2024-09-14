import clsx from 'clsx';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { Instruction } from 'components/text';

type DrawInstructionProps = {
  timeLimit: number;
};
export const DrawInstruction = ({ timeLimit }: DrawInstructionProps) => (
  <Instruction>
    <Translate
      pt={
        <>
          Você terá <TimeHighlight>{timeLimit}</TimeHighlight> segundos para ler a sua carta e desenhá-la.
          <br />
          Aperte o botão quando estiver pronto!
          <br />
          <span className={clsx(getAnimationClass('tada'))}>
            <strong>Não vale usar números e letras.</strong>
          </span>
          <br />
          Fique esperto porque o tempo começa assim que você apertar.
        </>
      }
      en={
        <>
          You'll have <TimeHighlight>{timeLimit}</TimeHighlight> seconds to read and draw your card.
          <br />
          Press the button when you're ready!
          <br />
          <span className={clsx(getAnimationClass('tada'))}>
            <strong>You can NOT use numbers or letters.</strong>
          </span>
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
          Encontre o par de cartas relacionado a cada desenho clicando em uma carta em seguida no desenho.
          <br />
          Quando você selecionar todos os pares, envie sua avaliação!
        </>
      }
      en={
        <>
          Match the pair of cards related to each drawing by clicking on a card and then on the drawing.
          <br />
          When you've selected all pairs, send your evaluation!
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
          Agora, mostraremos cada placa, o que os jogadores votaram e a resposta final.
          <br />
          Se você acertou as duas cartas, você ganha <PointsHighlight type="positive">2</PointsHighlight>{' '}
          pontos e o artista ganha <PointsHighlight type="positive">3</PointsHighlight> pontos.
          <br />
          Se você acertou uma das cartas, você NÃO ganha nada, mas o artista ganha{' '}
          <PointsHighlight type="positive">1</PointsHighlight> ponto.
        </>
      }
      en={
        <>
          Now we show each art, what players voted, and the final answer.
          <br />
          If you matched both cards, you get <PointsHighlight type="positive">2</PointsHighlight> points and
          the artist gets <PointsHighlight type="positive">3</PointsHighlight> points.
          <br />
          If you matched one card, you get nothing, but the artist gets{' '}
          <PointsHighlight type="positive">1</PointsHighlight> point.
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
          Se você acertou as duas cartas, você ganha <PointsHighlight type="positive">2</PointsHighlight>{' '}
          pontos e o artista ganha <PointsHighlight type="positive">3</PointsHighlight> pontos.
          <br />
          Se você acertou uma das cartas, você NÃO ganha nada, mas o artista ganha{' '}
          <PointsHighlight type="positive">1</PointsHighlight> ponto.
        </>
      }
      en={
        <>
          If you matched both cards, you get <PointsHighlight type="positive">2</PointsHighlight> points and
          the artist gets <PointsHighlight type="positive">3</PointsHighlight> points.
          <br />
          If you matched one card, you get nothing, but the artist gets{' '}
          <PointsHighlight type="positive">1</PointsHighlight> point.
        </>
      }
    />
  </Instruction>
);
