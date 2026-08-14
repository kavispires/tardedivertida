// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';

export function WritingCluesRule({ playerCount }: { playerCount: number }) {
  return (
    <Surface>
      <Translate
        pt={
          <>
            Você tem uma coordenada específica e única na grade de palavras.
            <br />
            Escreva uma dica (palavra única) que conecte as palavras da linha e da coluna assinalada a você.
            <br />
            Escreva algo bem simples e óbvio porque se ninguém entender você perderá{' '}
            <PointsHighlight
              type="negative"
              value={-playerCount}
            />{' '}
            pontos.
          </>
        }
        en={
          <>
            You will get an unique coordinate in the word grid.
            <br />
            You must write a single word clue that connects the word in the column and in the row of your
            coordinate.
            <br />
            Write something simple and obvious because if nobody gets your clue you will lose{' '}
            <PointsHighlight
              type="negative"
              value={-playerCount}
            />{' '}
            points.
          </>
        }
      />
    </Surface>
  );
}

export function ScoringRule({ playerCount }: { playerCount: number }) {
  return (
    <Surface>
      <Translate
        pt={
          <>
            Você ganha <PointsHighlight value={2} /> para cada célula com uma resposta correta sua.
            <br />
            <PointsHighlight value={1} /> para cada célula com uma dica mas uma resposta errada sua.
            <br />
            <PointsHighlight value={1} /> para cada voto correto que sua dica recebeu.
            <br />
            Mas se ninguém acertar sua dica, você perde{' '}
            <PointsHighlight
              type="negative"
              value={-playerCount}
            />{' '}
            pontos.
          </>
        }
        en={
          <>
            You get <PointsHighlight value={2} /> for each cell with your correct answer.
            <br />
            <PointsHighlight value={1} /> for each cell with a clue but with a wrong answer of yours.
            <br />
            <PointsHighlight value={1} /> for each correct vote your clue received.
            <br />
            But if nobody gets your clue correctly, you lose{' '}
            <PointsHighlight
              type="negative"
              value={-playerCount}
            />{' '}
            points.
          </>
        }
      />
    </Surface>
  );
}
