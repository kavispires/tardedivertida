import { orderBy } from 'lodash';
import { ReactNode, useMemo } from 'react';
// Ant Design Resources
import { Layout, Row, Divider, Collapse } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import GAME_LIST from 'utils/info';
import ACHIEVEMENTS_DICT from 'utils/achievements';
import { availableGamesCount, durationToHours, playableGames, timestampToDate } from './utils';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
import { SealOfApprovalIcon } from 'icons/SealOfApprovalIcon';
import { UserStatsIcon } from 'icons/UserStatsIcon';
import { SkullIcon } from 'icons/SkullIcon';
import { DiceIcon } from 'icons/DiceIcon';
import { CatalogIcon } from 'icons/CatalogIcon';
import { ClockIcon } from 'icons/ClockIcon';
import { CalendarIcon } from 'icons/CalendarIcon';
import { PlayersIcon } from 'icons/PlayersIcon';
// Components
import { DualTranslate, LanguageSwitch, Translate } from 'components/language';
import { Title } from 'components/text';
import { UserName } from './components/UserName';
import { Avatar, IconAvatar } from 'components/avatars';
import { StatisticCard } from './components/StatisticCard';
import { GameStatistics } from './components/GameStatistics';
import { InfoCard } from './components/InfoCard';
import { GameCheckCard } from './components/GameCheckCard';
// Sass
import './Me.scss';

type MeContentProps = {
  user: Me;
  additionalContent: ReactNode;
};

export function MeContent({ user, additionalContent }: MeContentProps) {
  const { language } = useLanguage();

  // Count achievable achievements only from the games the user has played
  const achievementsCount = useMemo(() => {
    return Object.entries(ACHIEVEMENTS_DICT).reduce((acc, [gameName, references]) => {
      if (references && user.games?.[gameName]) {
        return acc + Object.keys(references).length;
      }
      return acc;
    }, 0);
  }, [user.games]);

  const games = useMemo(
    () => orderBy(Object.values(user.games), (game) => GAME_LIST[game.gameName].title[language]),
    [user.games, language]
  );

  const alphabetizedPlayableGames = useMemo(
    () => orderBy(Object.values(playableGames), `title.${language}`),
    [language]
  );

  return (
    <Layout className="me__container">
      <Layout.Content className="container me__content">
        {additionalContent}

        <header className="me__header">
          <Title size="small" level={1} align="left">
            <IconAvatar icon={<UserStatsIcon />} size="large" />
            <Translate pt="Página do Usuário" en="User Page" /> <UserName names={user.names} />
          </Title>
          <LanguageSwitch />
        </header>

        <Row gutter={8}>
          <InfoCard title={<Translate pt="Nomes usados" en="Used Names" />}>{user.names.join(', ')}</InfoCard>

          <InfoCard title={<Translate pt="Avatares preferidos" en="Favorite Avatars" />}>
            {user.avatars.map((avatarId) => (
              <Avatar key={avatarId} id={avatarId} shape="square" />
            ))}
          </InfoCard>
        </Row>

        <Divider />

        <Row gutter={8}>
          <StatisticCard
            title={<Translate pt="Total de Partidas" en="Total Plays" />}
            icon={<DiceIcon />}
            value={user.statistics.plays}
          />

          <StatisticCard
            title={<Translate pt="Jogos" en="Played Games" />}
            icon={<CatalogIcon />}
            value={user.statistics.uniqueGamesPlayed}
            suffix={`/${availableGamesCount}`}
          />

          <StatisticCard
            title={<Translate pt="Vitórias" en="Victories" />}
            value={(user.statistics.win / user.statistics.winnableGames) * 100}
            icon={<TrophyIcon />}
            precision={0}
            suffix="%"
            disabled={!Boolean(user.statistics.winnableGames)}
          />

          <StatisticCard
            title={<Translate pt="Jogos em Último" en="Dead Last" />}
            value={(user.statistics.last / user.statistics.winnableGames) * 100}
            icon={<SkullIcon />}
            precision={0}
            suffix="%"
            disabled={!Boolean(user.statistics.winnableGames)}
          />

          <StatisticCard
            title={<Translate pt="Tempo Jogado" en="Play Duration" />}
            value={durationToHours(user.statistics.totalPlayDuration)}
            icon={<ClockIcon />}
            suffix={<Translate pt="horas" en="hours" />}
            precision={1}
          />

          <StatisticCard
            title={<Translate pt="Partida Mais Recente" en="Latest Play" />}
            value={timestampToDate(user.statistics.latestPlay.startedAt)}
            icon={<CalendarIcon />}
          />

          <StatisticCard
            title={<Translate pt="Média de Jogadores" en="Average Player Count" />}
            value={user.statistics.averagePlayerCount}
            icon={<PlayersIcon />}
            precision={1}
            suffix={<Translate pt="jogadores" en="players" />}
          />

          <StatisticCard
            title={<Translate pt="Total de Medalhas" en="Total Achievements" />}
            value={user.statistics.achievements}
            icon={<SealOfApprovalIcon />}
            suffix={`/${achievementsCount}`}
          />
        </Row>

        <Divider />

        <Title size="x-small" level={2} align="left">
          <Translate pt="Jogos" en="Games" />
        </Title>

        <GameCheckCard info={alphabetizedPlayableGames} games={user.games} />

        <Divider />

        <Title size="x-small" level={2} align="left">
          <Translate pt="Estatísticas Por Jogo" en="Per Game Stats" />
        </Title>

        <Collapse>
          {games.map((game) => {
            const info = GAME_LIST[game.gameName];
            return (
              <Collapse.Panel header={<DualTranslate>{info.title}</DualTranslate>} key={game.gameName}>
                <GameStatistics
                  key={game.gameName}
                  game={game}
                  info={info}
                  achievements={ACHIEVEMENTS_DICT[game.gameName]}
                />
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </Layout.Content>
    </Layout>
  );
}