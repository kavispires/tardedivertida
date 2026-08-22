// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';

export function WritingCluesRule({ playerCount }: { playerCount: number }) {
  return (
    <Surface>
      <Translate
        pt="Você tem uma coordenada específica e única na grade de palavras.
        <br/>
        Escreva uma dica (palavra única) que conecte as palavras da linha e da coluna assinalada a você.
        <br/>
        Escreva algo bem simples e óbvio porque se ninguém entender você perderá {penalty} pontos."
        en="You will get an unique coordinate in the word grid.
        <br/>
        You must write a single word clue that connects the word in the column and in the row of your coordinate.
        <br/>
        Write something simple and obvious because if nobody gets your clue you will lose {penalty} points."
        values={{
          penalty: (
            <PointsHighlight
              type="negative"
              value={-playerCount}
            />
          ),
        }}
      />
    </Surface>
  );
}

export function ScoringRule({ playerCount }: { playerCount: number }) {
  return (
    <Surface>
      <Translate
        pt="Você ganha {correctAnswerPoints} para cada célula com uma resposta correta sua.
        <br/>
        {wrongAnswerPoints} para cada célula com uma dica mas uma resposta errada sua.
        <br/>
        {votePoints} para cada voto correto que sua dica recebeu.
        <br/>
        Mas se ninguém acertar sua dica, você perde {penalty} pontos."
        en="You get {correctAnswerPoints} for each cell with your correct answer.
        <br/>
        {wrongAnswerPoints} for each cell with a clue but with a wrong answer of yours.
        <br/>
        {votePoints} for each correct vote your clue received.
        <br/>
        But if nobody gets your clue correctly, you lose {penalty} points."
        values={{
          correctAnswerPoints: <PointsHighlight value={2} />,
          wrongAnswerPoints: <PointsHighlight value={1} />,
          votePoints: <PointsHighlight value={1} />,
          penalty: (
            <PointsHighlight
              type="negative"
              value={-playerCount}
            />
          ),
        }}
      />
    </Surface>
  );
}
