// Components
import { Translate } from 'components/language';

export const DreamTellingRules = () => (
  <Translate
    pt={
      <>
        Escreva uma dica dentro do tema dado para o seu sonho (carta com borda amarela).
        <br />
        Preste atenção em seu pesadelo (carta com borda roxa), se alguém achar que sua dica é relacionada a
        seu pesadelo, você perde pontos.
      </>
    }
    en={
      <>
        Write a clue for your dream (yellow bordered card).
        <br />
        Pay attention to your nightmare (purple bordered card) because if any player thinks that your clue is
        related to that card, you lose points.
      </>
    }
  />
);
