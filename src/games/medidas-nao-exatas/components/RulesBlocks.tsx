// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
// Internal
import { SecretWordHighlight, WordsHighlight } from './Highlights';

export function GuessingRules() {
  return (
    <Translate
      en={
        <>
          Among the <WordsHighlight>5 words</WordsHighlight>, you must guess the{' '}
          <SecretWordHighlight>secret word</SecretWordHighlight>. Every{' '}
          <TimeHighlight>10 seconds</TimeHighlight> one of the 5 metrics shows up to help you! You can make a
          guess at any moment. The earlier you make the guess,{' '}
          <PointsHighlight type="positive">more points</PointsHighlight> you get. If you decide to change your
          guess, you can do it once, but that will be your new score and{' '}
          <PointsHighlight type="negative">- 1 point</PointsHighlight>.
        </>
      }
      pt={
        <>
          Entre as <WordsHighlight>5 palavras</WordsHighlight>, você deve adivinhar a{' '}
          <SecretWordHighlight>palavra secreta</SecretWordHighlight>. A cada{' '}
          <TimeHighlight>10 segundos</TimeHighlight> uma das 5 métricas aparece para ajudar. Você pode fazer
          um palpite a qualquer momento. Quanto mais cedo você fizer o palpite,{' '}
          <PointsHighlight type="positive">mais pontos</PointsHighlight> você ganha. Se decidir mudar seu
          palpite, você pode fazê-lo uma vez, mas isso resultará em uma nova pontuação e{' '}
          <PointsHighlight type="negative">- 1 ponto</PointsHighlight>.
        </>
      }
    />
  );
}
