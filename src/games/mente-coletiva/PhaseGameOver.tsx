// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { MedalArrowDownIcon } from 'components/icons/MedalArrowDownIcon';
import { MedalArrowUpIcon } from 'components/icons/MedalArrowUpIcon';
import { MedalFootprintsIcon } from 'components/icons/MedalFootprintsIcon';
import { MedalPersonIcon } from 'components/icons/MedalPersonIcon';
import { MedalSkullIcon } from 'components/icons/MedalSkullIcon';
import { TheEndIcon } from 'components/icons/TheEndIcon';
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { SheepAvatar } from './components/SheepAvatar';

function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper
      info={info}
      state={state}
      announcementIcon={<TheEndIcon />}
      rateWidgetCustomText={<Translate pt="Sugira uma pergunta:" en="Suggest a question:" />}
    >
      <div className="m-game-over-in-memoriam">
        <Title>In memoriam</Title>
        <div className="m-sheep-rip">
          {state.losers.map((player: GamePlayer) => {
            return (
              <div className="m-sheep-rip__entry" key={`sheep-player-1`}>
                <SheepAvatar id={player.avatarId} width={80} sheepId={player.sheepId} />
                <span className="m-sheep-rip__name">{player.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />
    </GameOverWrapper>
  );
}

const achievementsReference: AchievementReference = {
  MOST_MATCHES: {
    icon: <MedalArrowUpIcon />,
    title: {
      pt: 'Mais Matches',
      en: 'Best Matcher',
    },
    description: {
      pt: 'As respostas combinaram mais vezes com outros jogadores',
      en: 'Their answers matched the most with other players',
    },
  },
  LEAST_MATCHES: {
    icon: <MedalArrowDownIcon />,
    title: {
      pt: 'Mais Diferentão',
      en: 'Most Unique',
    },
    description: {
      pt: 'As respostas combinaram menos vezes com outros jogadores',
      en: 'Their answers matched the least with other players',
    },
  },
  MOST_DEAD: {
    icon: <MedalSkullIcon />,
    title: {
      pt: 'Mais Morta',
      en: 'Most Dead',
    },
    description: {
      pt: 'A única ovelhinha morta no final',
      en: 'The only dead sheep in the end',
    },
  },
  MOST_LONELY: {
    icon: <MedalPersonIcon />,
    title: {
      pt: 'Mais Solitária',
      en: 'Most Lonely',
    },
    description: {
      pt: 'A única ovelhinha num pasto sozinha no final',
      en: 'The only sheep by itself in the end',
    },
  },
  BEST_TRAVELER: {
    icon: <MedalFootprintsIcon />,
    title: {
      pt: 'Mais Viajada',
      en: 'Best Traveler',
    },
    description: {
      pt: 'Ovelhinha que mais moveu pra direita e esquerda',
      en: 'Sheep who moved the most left or right',
    },
  },
};

export default PhaseGameOver;
