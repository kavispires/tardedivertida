import { Space } from 'antd';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { IconAvatar } from 'components/icons/IconAvatar';
import { MedalArrowDownIcon } from 'components/icons/MedalArrowDownIcon';
import { MedalArrowUpIcon } from 'components/icons/MedalArrowUpIcon';
import { MedalCloseIcon } from 'components/icons/MedalCloseIcon';
import { MedalLightBulbIcon } from 'components/icons/MedalLightBulbIcon';
import { MedalNarrowIcon } from 'components/icons/MedalNarrowIcon';
import { TrophyIcon } from 'components/icons/TrophyIcon';
import { WavelengthDeviceIcon } from 'components/icons/WavelengthDeviceIcon';
import { Translate } from 'components/language';

function PhaseGameOver({ state, players, info }: PhaseProps) {
  return (
    <GameOverWrapper
      info={info}
      state={state}
      announcementIcon={<TrophyIcon />}
      rateWidgetCustomText={
        <Translate
          pt="Alguma sugestão de cartas com ideias opostas?"
          en="Any two-opposing ideas suggestions?"
        />
      }
    >
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <Space wrap align="center" className="o-past-category">
        {state.pastCategories.map((category: any) => {
          return (
            <div key={category.id} className="o-past-category-entry">
              <IconAvatar icon={<WavelengthDeviceIcon />} size={48} />
              <header className="o-past-category-entry__category">
                {category.target < 0 && category.left}
                {category.target > 0 && category.right}
                {category.target === 0 && `${category.left}-${category.right}`}
                <div className="o-past-category-entry__number">{Math.abs(category.target)}</div>
              </header>
              <div className="o-past-category-entry__clue">{category.clue}</div>
              <div className="o-past-category-entry__author">
                by {players?.[category.psychicId]?.name ?? '?'}
              </div>
            </div>
          );
        })}
      </Space>
    </GameOverWrapper>
  );
}

const achievementsReference: AchievementReference = {
  MOST_ACCURATE: {
    icon: <MedalArrowUpIcon />,
    title: {
      pt: 'Mais Preciso',
      en: 'Best Accurate',
    },
    description: {
      pt: 'Os palpites foram mais próximos do ponteiro do que qualquer outro jogador',
      en: 'Their guesses were closer to the needle than other players',
    },
  },
  LEAST_ACCURATE: {
    icon: <MedalArrowDownIcon />,
    title: {
      pt: 'Menos Preciso',
      en: 'Least Accurate',
    },
    description: {
      pt: 'Os palpites foram mais longe do ponteiro do que qualquer outro jogador',
      en: 'Their guesses were farther to the needle than other players',
    },
  },
  MOST_EXACT: {
    icon: <MedalNarrowIcon />,
    title: {
      pt: 'Mais Exato',
      en: 'Most Exact',
    },
    description: {
      pt: 'Mais palpites exatamente no ponteiro do que qualquer outro jogador',
      en: 'Most guesses exactly on the needle than other players',
    },
  },
  BEST_PSYCHIC: {
    icon: <MedalLightBulbIcon />,
    title: {
      pt: 'Melhor Medium',
      en: 'Best Medium',
    },
    description: {
      pt: 'Ganhou mais pontos por outros jogadores adivinhando sua dica',
      en: 'Got the most points by other players guessing their clue',
    },
  },
  MOST_ZEROS: {
    icon: <MedalCloseIcon />,
    title: {
      pt: 'Mais Diferentão',
      en: 'Outside of the Box Thinker',
    },
    description: {
      pt: 'Não ganhou nenhum ponto em mais rodadas',
      en: 'Did not score any points in a round more times',
    },
  },
};

export default PhaseGameOver;
