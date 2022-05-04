// Ant Design Resources
import { ExclamationCircleOutlined } from '@ant-design/icons';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';

export function WritingRules(): JSX.Element {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Hora de escrever uma dica para a palavra secreta!
            <br />
            A dica tem que ser uma palavra única que ajude o adivinhador... adivinhar.
            <br />
            É proibido usar derivados, partes da palavra ou traduções em outras línguas.
            <br />E não seja tão óbvio, já que dicas similares são eliminadas!
          </>
        }
        en={
          <>
            Time to write a clue for the secret word!
            <br />
            The clue MUST be a single word or compound word that helps the guesser... guess.
            <br />
            You can't use parts of the Secret word, translations, words in the same family (prince/princess),
            made-up words, or phonetically identical (weather/whether).
            <br />
            Don't be too obvious, identical words (and variants) will be eliminated!
          </>
        }
      />
    </Instruction>
  );
}

export function ComparisonRules(): JSX.Element {
  return (
    <Instruction>
      <Translate
        pt={
          <>
            Hora de comparar as dicas e eliminar as similares!
            <br />O aplicativo elimina automaticamente todas as palavras idênticas, mas os jogadores precisam
            eliminar as inválidas e similares.
          </>
        }
        en={
          <>
            Time to compare the clues and eliminate variants
            <br />
            The app has already eliminated any identical clues.
          </>
        }
      />
    </Instruction>
  );
}

export function ComparisonDetailedRules(): JSX.Element {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Já eliminamos todas as palavras idênticas, agora, elimine palavras inválidas ou similares.
            <br />
            Lembre-se que são consideradas dicas iguais palavras derivadas e conjugações:{' '}
            <code>piloto = pilotar = pilotando</code>. Variações como pluralidade, gênero e erros ortográficos
            também devem ser eliminadas: <code>príncipe = princesa = príncipes = pryncipi</code>.
          </>
        }
        en={
          <>
            The app has already eliminated all identical clues, not it's time to eliminate all invalid clues.
            <br />
            Remember that the following clue types are considered invalid:
            <br />
            Variants: <code>pilot = pilots = piloting</code>.
            <br />
            Words on the same family: <code>prince = princess</code>
            <br />
            Misspelled or made-up words.
          </>
        }
      />
    </Instruction>
  );
}
export function ComparisonPhaseRules({ controller }: { controller: GamePlayer }): JSX.Element {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            <ExclamationCircleOutlined /> Para não virar bagunça, somente{' '}
            <AvatarName player={controller} addressUser />
            pode clicar nas palavras para eliminá-las ou ativá-las, mas todos podem discutir.
            <br />
            Uma dica ser muito ruim não significa que ela seja inválida.
            <br />
            Refiram às palavras por letra, o Adivinhador pode estar ouvindo!
          </>
        }
        en={
          <>
            <ExclamationCircleOutlined /> <AvatarName player={controller} />
            is in charge of clicking on the clues to disable or enable them as valid but everybody (but the
            guesser) should discuss.
            <br />
            A terrible clue is still valid if it follow the rules.
            <br />
            Refer to the clues by letter, the Guesser is listening!
          </>
        }
      />
    </Instruction>
  );
}

export function GuessingRules({ guesserName }: { guesserName: string }): JSX.Element {
  return (
    <Instruction>
      <Translate
        pt={
          <>
            Hora de {guesserName} brilhar!
            <br />
            Você tem uma única change de adivinhar a palavra secreta!
            <br />
            Pense em voz alta! (É mais divertido para os outros jogadores)
          </>
        }
        en={
          <>
            It's time to shine, {guesserName}!
            <br />
            You have a single chance to guess the secret word!
            <br />
            Think out loud! (It's more entertaining to the other players)
          </>
        }
      />
    </Instruction>
  );
}
