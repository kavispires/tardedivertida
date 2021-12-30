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
