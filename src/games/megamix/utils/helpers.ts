// Ant Design Resources
import type { StepsProps } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { MovieCard } from 'types/tdr';
// Internal
import type { SeedEntry } from './types';

export const buildSeedingSteps = (
  seeds: SeedEntry[],
  translate: (params: { pt: string; en: string; custom?: string }) => string,
): StepsProps['items'] => {
  return seeds.map((seed) => {
    switch (seed.type) {
      case 'arte-ruim':
        return {
          title: translate({ pt: 'Hobby Artístico', en: 'Artistic Hobby' }),
          description: translate({ pt: 'Se expresse!', en: 'Express yourself!' }),
        };

      case 'contadores-historias':
        return {
          title: translate({ pt: 'Torpedo da sua mãe', en: 'Text from your mom' }),
          description: translate({ pt: 'O que ela quer agora?', en: 'What does she want now?' }),
        };

      case 'labirinto-secreto':
        return {
          title: translate({ pt: 'Postando no Insta', en: 'Instagram post' }),
          description: translate({ pt: 'Não existe sexy demais!', en: 'Do it for the likes!' }),
        };

      case 'mente-coletiva':
        return {
          title: translate({ pt: 'Tik Tok', en: 'Tik Tok' }),
          description: translate({ pt: 'Sempre temos um tempinho!', en: "There's always time!" }),
        };
      case 'party':
      case 'onda-telepatica':
        return {
          title: translate({ pt: 'Tarefa de Casa', en: 'Homework' }),
          description: translate({
            pt: 'Não pode deixar pra depois!',
            en: "You can't leave it for tomorrow!",
          }),
        };
      case 'polemica-da-vez':
        return {
          title: translate({ pt: 'Redes sociais', en: 'Social Media' }),
          description: translate({ pt: 'Dê uma olhada no twitter', en: 'Check it out twitter' }),
        };
      case 'retrato-falado':
        return {
          title: translate({ pt: 'Flashback', en: 'Flashback' }),
          description: translate({ pt: 'Um evento traumatizante', en: 'A traumatizing event' }),
        };
      case 'ue-so-isso':
        return {
          title: translate({ pt: 'Torpedo do Amigo', en: "A friend's text" }),
          description: translate({ pt: 'Responda!', en: 'Reply!' }),
        };
      case 'clubber':
        return {
          title: translate({ pt: 'Look', en: 'Outfit' }),
          description: translate({ pt: 'Como ir pra balada', en: 'How to be cool' }),
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
