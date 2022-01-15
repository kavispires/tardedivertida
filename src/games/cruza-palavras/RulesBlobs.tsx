import { Instruction, Translate } from '../../components';

export function WritingCluesRule({ playerCount }: { playerCount: number }) {
  return (
    <Instruction>
      <Translate
        pt={
          <>
            Você tem uma coordenada específica e única na grade de palavras.
            <br />
            Escreva uma dica (palavra única) que conecte as palavras da linha e da coluna assinalada a você.
            <br />
            Escreva algo bem simples e óbvio porque se ninguém entender você perderá {playerCount} pontos.
          </>
        }
        en={
          <>
            You will get an unique coordinate in the word grid.
            <br />
            You must write a single word clue that connects the word in the column and in the row of your
            coordinate.
            <br />
            Write something simple and obvious because if nobody gets your clue you will lose {
              playerCount
            }{' '}
            points.
          </>
        }
      />
    </Instruction>
  );
}

export function ScoringRule({ playerCount }: { playerCount: number }) {
  return (
    <Instruction>
      <Translate
        pt={
          <>
            Você ganha 2 pontos para cada célula com uma resposta correta sua.
            <br />
            + 1 ponto para cada célula com uma dica mas uma resposta errada sua.
            <br />
            + 1 ponto para cada voto correto que sua dica recebeu.
            <br />
            Mas se ninguém acertar sua dica, você perde {playerCount} pontos.
          </>
        }
        en={
          <>
            You get 2 points for each cell with your correct answer.
            <br />
            + 1 point for each cell with a clue but with a wrong answer of yours.
            <br />
            + 1 point for each correct vote your clue received.
            <br />
            But if nobody gets your clue correctly, you lose {playerCount} points.
          </>
        }
      />
    </Instruction>
  );
}
