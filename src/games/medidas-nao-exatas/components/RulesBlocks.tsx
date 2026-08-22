// Components
import { Translate } from '@components/language/Translate';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { TimeHighlight } from '@components/metrics/TimeHighlight';
// Internal
import { SecretWordHighlight, WordsHighlight } from './Highlights';

export function GuessingRules() {
  return (
    <Translate
      en="Among the <words>5 words</words>, you must guess the <secretWord>secret word</secretWord>.
      <br/>
      Every <time>10 seconds</time> one of the 5 metrics shows up to help you! You can make a guess at any moment.
      <br/>
      The earlier you make the guess, <morePoints>more points</morePoints> you get.
      <br/>
      If you decide to change your guess, you can do it once, but that will be your new score and {penalty}."
      pt="Entre as <words>5 palavras</words>, você deve adivinhar a <secretWord>palavra secreta</secretWord>.
      <br/>
      A cada <time>10 segundos</time> uma das 5 métricas aparece para ajudar. Você pode fazer um palpite a qualquer momento.
      <br/>
      Quanto mais cedo você fizer o palpite, <morePoints>mais pontos</morePoints> você ganha.
      <br/>
      Se decidir mudar seu palpite, você pode fazê-lo uma vez, mas isso resultará em uma nova pontuação e {penalty}."
      values={{
        words: (text) => <WordsHighlight>{text}</WordsHighlight>,
        secretWord: (text) => <SecretWordHighlight>{text}</SecretWordHighlight>,
        time: (text) => <TimeHighlight>{text}</TimeHighlight>,
        morePoints: (text) => (
          <PointsHighlight
            type="positive"
            value={text}
          />
        ),
        penalty: (
          <PointsHighlight
            type="negative"
            value={-1}
          />
        ),
      }}
    />
  );
}
