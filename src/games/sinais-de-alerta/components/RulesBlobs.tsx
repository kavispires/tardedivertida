import clsx from 'clsx';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { TimeHighlight } from '@components/metrics/TimeHighlight';

type DrawInstructionProps = {
  timeLimit: number;
};
export const DrawInstruction = ({ timeLimit }: DrawInstructionProps) => (
  <Surface>
    <Translate
      en="You will have {time} seconds to read and draw your card.
      <br/>
      Press the button when you're ready!
      </br>
      <tada>You can NOT use numbers or letters.</tada>
      <br/>
      Be aware of the timer! It starts as soon as you press the button.
          "
      pt="Você terá {time} segundos para ler a sua carta e desenhá-la.
      <br/>
      Aperte o botão quando estiver pronto!
      <br/>
      <tada>Não vale usar números e letras.</tada>
      <br/>
      Fique esperto porque o tempo começa assim que você apertar."
      values={{
        time: <TimeHighlight>{timeLimit}</TimeHighlight>,
        tada: (text) => (
          <span className={clsx(getAnimationClass('tada'))}>
            <strong>{text}</strong>
          </span>
        ),
      }}
    />
  </Surface>
);

export const EvaluationRules = () => (
  <Surface>
    <Translate
      pt="Encontre o par de cartas relacionado a cada desenho clicando em uma carta em seguida no desenho.
      <br/>
      Quando você selecionar todos os pares, envie sua avaliação!"
      en="Match the pair of cards related to each drawing by clicking on a card and then on the drawing.
      <br/>
      When you've selected all pairs, send your evaluation!"
    />
  </Surface>
);

export const GalleryRules = () => (
  <Surface>
    <Translate
      en="Now we show each art, what players voted, and the final answer.
      <br/>
      If you matched both cards, you get {matchPoints} and the artist gets {artistPoints}.
      <br/>
      If you matched only one card, you get nothing but the artist gets {artistBonus}"
      pt="Agora, mostraremos cada placa, o que os jogadores votaram e a resposta final.
      <br/>
      Se você acertou as duas cartas, você ganha {matchPoints} e o artista ganha {artistPoints}.
      <br/>
      Se você acertou uma das cartas, você NÃO ganha nada, mas o artista ganha {artistBonus}.
          "
      values={{
        matchPoints: (
          <PointsHighlight
            type="positive"
            value={2}
          />
        ),
        artistPoints: (
          <PointsHighlight
            type="positive"
            value={3}
          />
        ),
        artistBonus: (
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
      en="If you matched both cards, you get {matchPoints} and the artist gets {artistPoints}.
      <br/>
      If you matched only one card, you get nothing but the artist gets {artistBonus}"
      pt="Se você acertou as duas cartas, você ganha {matchPoints} e o artista ganha {artistPoints}.
      <br/>
      Se você acertou uma das cartas, você NÃO ganha nada, mas o artista ganha {artistBonus}.
          "
      values={{
        matchPoints: (
          <PointsHighlight
            type="positive"
            value={2}
          />
        ),
        artistPoints: (
          <PointsHighlight
            type="positive"
            value={3}
          />
        ),
        artistBonus: (
          <PointsHighlight
            type="positive"
            value={1}
          />
        ),
      }}
    />
  </Surface>
);
