// Components
import { Translate } from '@components/language/Translate';
// Internal
import { ActorHighlight } from './Highlights';

export function MovieGenreRules() {
  return (
    <Translate
      pt="Somos diretores de elenco tentando determinar os atores para um filme! Haverá <highlight>5 papéis</highlight> para escalar, mas primeiro precisamos decidir qual é o gênero do filme em que vamos trabalhar!"
      en="We are casting directors trying to determine the cast for a movie! There will be <highlight>5 roles</highlight> to cast, but we first need to decide what genre is the movie we'll be working on!"
      values={{
        highlight: (text) => <ActorHighlight>{text}</ActorHighlight>,
      }}
    />
  );
}
