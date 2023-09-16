import { StepProps } from 'antd';

export const buildSeedingSteps = (
  seeds: SeedEntry[],
  translate: (pt: string, en: string, custom?: string | undefined) => string
): StepProps[] => {
  return seeds.map((seed) => {
    switch (seed.type) {
      case 'arte-ruim':
        return {
          title: translate('Hobby Artístico', 'Artistic Hobby'),
          description: translate('Se expresse!', 'Express yourself!'),
        };

      case 'contadores-historias':
        return {
          title: translate('Torpedo da sua mãe', 'Text from your mom'),
          description: translate('O que ela quer agora?', 'What does she want now?'),
        };

      case 'labirinto-secreto':
        return {
          title: translate('Postando no Insta', 'Instagram post'),
          description: translate('Não existe sexy demais!', 'Do it for the likes!'),
        };

      case 'mente-coletiva':
        return {
          title: translate('Tik Tok', 'Tik Tok'),
          description: translate('Sempre temos um tempinho!', "There's always time!"),
        };

      case 'onda-telepatica':
        return {
          title: translate('Tarefa de Casa', 'Homework'),
          description: translate('Não pode deixar pra depois!', "You can't leave it for tomorrow!"),
        };
      case 'polemica-da-vez':
        return {
          title: translate('Redes sociais', 'Social Media'),
          description: translate('Dê uma olhada no twitter', 'Check it out twitter'),
        };
      case 'retrato-falado':
        return {
          title: translate('Flashback', 'Flashback'),
          description: translate('Um evento traumatizante', 'A traumatizing event'),
        };
      case 'ue-so-isso':
        return {
          title: translate('Torpedo do Amigo', "A friend's text"),
          description: translate('Responda!', 'Reply!'),
        };
      case 'clubber':
        return {
          title: translate('Look', 'Outfit'),
          description: translate('Como ir pra balada', 'How to be cool'),
        };
      default:
        return {};
    }
  });
};

export const showDJPruPruPruStep = (round: GameRound) => {
  if (round.current <= 1 || !round) return 0; // true

  if (round.current === Math.round(round.total / 2)) return 0;

  if (round.current === round.total) return 0;

  return 1; // false
};

export const getMovieTitles = (movies: MovieCard[]) => {
  return {
    A: `${movies[0].prefix} ${movies[1].suffix}`,
    B: `${movies[1].prefix} ${movies[2].suffix}`,
    C: `${movies[3].prefix} ${movies[4].suffix}`,
    D: `${movies[4].prefix} ${movies[5].suffix}`,
  };
};
