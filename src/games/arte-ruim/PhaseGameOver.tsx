// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { MedalBrushIcon } from 'components/icons/MedalBrushIcon';
import { MedalPersonIcon } from 'components/icons/MedalPersonIcon';
import { MedalThumbsDownIcon } from 'components/icons/MedalThumbsDownIcon';
import { TrophyIcon } from 'components/icons/TrophyIcon';
import { Translate } from 'components/language';
import { MedalQuestionMarkIcon } from 'components/icons/MedalQuestionMarkIcon';
import { MedalLightBulbIcon } from 'components/icons/MedalLightBulbIcon';
import { FinalGallery } from './components/FinalGallery';

function PhaseGameOver({ state, players, info }: PhaseProps) {
  return (
    <GameOverWrapper
      info={info}
      state={state}
      announcementIcon={<TrophyIcon />}
      rateWidgetCustomText={<Translate pt="Alguma sugestão de carta?" en="Any card suggestions?" />}
    >
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <FinalGallery players={players} drawings={state.drawings} />
    </GameOverWrapper>
  );
}

const achievementsReference: AchievementReference = {
  BEST_ARTIST: {
    icon: <MedalBrushIcon />,
    title: {
      pt: 'Melhor Artista',
      en: 'Best Artist',
    },
    description: {
      pt: 'Todos os jogadores acertaram unanimemente seu desenho mais vezes',
      en: 'Got players to guess your drawing unanimously the most',
    },
  },
  WORST_ARTIST: {
    icon: <MedalQuestionMarkIcon />,
    title: {
      pt: 'Artista Mais Não Convencional',
      en: 'Most Unconventional Artist',
    },
    description: {
      pt: 'Todos os jogadores NÃO acertaram unanimemente seu desenho mais vezes',
      en: 'Got players to miss your drawing unanimously the most',
    },
  },
  SOLITARY_WINNER: {
    icon: <MedalPersonIcon />,
    title: {
      pt: 'Adivinhador Solitário',
      en: 'Best Solitary Guesser',
    },
    description: {
      pt: 'Foi o único que acertou o desenho mais vezes',
      en: 'Was the only one to get the drawing the most',
    },
  },
  SOLITARY_LOSER: {
    icon: <MedalLightBulbIcon />,
    title: {
      pt: 'Mais Diferentão',
      en: 'Most Unique Guesser',
    },
    description: {
      pt: 'Foi o único que errou o desenho mais vezes',
      en: 'Was the only one to get the drawing the most',
    },
  },
  TABLE_VOTES: {
    icon: <MedalThumbsDownIcon />,
    title: {
      pt: 'Melhor Votador Pra Mesa',
      en: 'Best Table Voter',
    },
    description: {
      pt: 'Votou nas cartas extras que não eram de nenhum jogador mais vezes',
      en: "Voted for extra cards that didn't belong to any player the most",
    },
  },
};

export default PhaseGameOver;
