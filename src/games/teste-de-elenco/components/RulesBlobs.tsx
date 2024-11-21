// Components
import { Translate } from 'components/language';
// Internal
import { ActorHighlight } from './Highlights';

export function MovieGenreRules() {
  return (
    <Translate
      pt={
        <>
          Somos diretores de elenco tentando determinar os atores para um filme! Haverá{' '}
          <ActorHighlight>5 papéis</ActorHighlight> para escalar, mas primeiro precisamos decidir qual é o
          gênero do filme em que vamos trabalhar!
        </>
      }
      en={
        <>
          We are casting directors trying to determine the cast for a movie! There will be{' '}
          <ActorHighlight>5 roles</ActorHighlight> to cast, but we first need to decide what genre is the
          movie we'll be working on!
        </>
      }
    />
  );
}
