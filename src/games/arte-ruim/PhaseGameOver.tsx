// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { MedalBrushIcon } from 'components/icons/MedalBrushIcon';
import { MedalCloseIcon } from 'components/icons/MedalCloseIcon';
import { MedalPersonIcon } from 'components/icons/MedalPersonIcon';
import { MedalThumbsDownIcon } from 'components/icons/MedalThumbsDownIcon';
import { MedalThumbsUpIcon } from 'components/icons/MedalThumbsUpIcon';
import { TrophyIcon } from 'components/icons/TrophyIcon';
import { Translate } from 'components/language';
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
    icon: <MedalCloseIcon />,
    title: {
      pt: 'Pior Artista',
      en: 'Worst Artist',
    },
    description: {
      pt: 'Todos os jogadores NÃO acertaram unanimemente seu desenho mais vezes',
      en: 'Got players to miss your drawing unanimously the most',
    },
  },
  SOLITARY_WINNER: {
    icon: <MedalThumbsUpIcon />,
    title: {
      pt: 'Vencedor Solitário',
      en: 'Solitary Winner',
    },
    description: {
      pt: 'Foi o único que acertou o desenho mais vezes',
      en: 'Was the only one to get the drawing the most',
    },
  },
  SOLITARY_LOSER: {
    icon: <MedalPersonIcon />,
    title: {
      pt: 'Perdedor Solitário',
      en: 'Solitary Loser',
    },
    description: {
      pt: 'Foi o único que errou o desenho mais vezes',
      en: 'Was the only one to get the drawing the most',
    },
  },
  TABLE_VOTES: {
    icon: <MedalThumbsDownIcon />,
    title: {
      pt: 'Mais Votos Pra Mesa',
      en: 'Most Table Votes',
    },
    description: {
      pt: 'Votou nas cartas extras que não eram de nenhum jogador mais vezes',
      en: "Voted for extra cards that didn't belong to any player the most",
    },
  },
};

export default PhaseGameOver;
