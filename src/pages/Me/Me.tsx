import { orderBy } from 'lodash';
import { useMemo } from 'react';
import { useTitle } from 'react-use';
// Ant Design Resources
import { Layout, Modal, Row, Divider, Collapse } from 'antd';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import GAME_LIST from 'utils/info';
import { NOOP } from 'utils/constants';
import { durationToHours, timestampToDate } from './utils';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
import { SealOfApprovalIcon } from 'icons/SealOfApprovalIcon';
import { UserStatsIcon } from 'icons/UserStatsIcon';
import { SkullIcon } from 'icons/SkullIcon';
import { DiceIcon } from 'icons/DiceIcon';
import { CatalogIcon } from 'icons/CatalogIcon';
import { ClockIcon } from 'icons/ClockIcon';
import { CalendarIcon } from 'icons/CalendarIcon';
// Components
import { DualTranslate, LanguageSwitch, Translate } from 'components/language';
import { SignIn } from 'components/auth/SignIn';
import { Title } from 'components/text';
import { UserName } from './components/UserName';
import { Avatar, IconAvatar } from 'components/avatars';
import { StatisticCard } from './components/StatisticCard';
import { GameStatistics } from './components/GameStatistics';
import { InfoCard } from './components/InfoCard';
// Sass
import './Me.scss';

const playableGames = Object.entries(GAME_LIST).reduce(
  (acc: Record<GameName, GameInfo>, [gameName, info]) => {
    if (info.version.includes('.')) {
      acc[gameName] = info;
    }
    return acc;
  },
  {}
);
const availableGamesCount = Object.keys(playableGames).length;

function Me() {
  useTitle('Me - Tarde Divertida');
  const { isAuthenticated, currentUser } = useCurrentUserContext();
  const { language } = useLanguage();

  const notAuthenticated = (
    <Modal
      open={!isAuthenticated}
      title={<Translate pt="Logar" en="LogIn" />}
      cancelText={<Translate pt="Cancelar" en="Cancel" />}
      onCancel={NOOP}
      okButtonProps={{
        style: { display: 'none' },
      }}
      cancelButtonProps={{
        style: { display: 'none' },
      }}
      closable={false}
    >
      <SignIn onSuccess={NOOP} />
    </Modal>
  );

  const games = useMemo(
    () => orderBy(Object.values(currentUser.games), (game) => GAME_LIST[game.gameName].title[language]),
    [currentUser.games, language]
  );

  return (
    <Layout className="me__container">
      <Layout.Content className="container me__content">
        {notAuthenticated}

        <header className="me__header">
          <Title size="x-small" level={1} align="left">
            <IconAvatar icon={<UserStatsIcon />} size="large" />
            <Translate pt="Página do Usuário" en="User Page" /> <UserName names={currentUser.names} />
          </Title>
          <LanguageSwitch />
        </header>

        <Divider />

        <Row gutter={8}>
          <InfoCard title={<Translate pt="Nomes usados" en="Used Names" />}>
            {currentUser.names.join(', ')}
          </InfoCard>

          <InfoCard title={<Translate pt="Avatares preferidos" en="Favorite Avatars" />}>
            {currentUser.avatars.map((avatarId) => (
              <Avatar key={avatarId} id={avatarId} shape="square" />
            ))}
          </InfoCard>
        </Row>

        <Divider />

        <Row gutter={8}>
          <StatisticCard
            title={<Translate pt="Total de Jogadas" en="Total Sessions" />}
            icon={<DiceIcon />}
            value={currentUser.statistics.plays}
          />

          <StatisticCard
            title={<Translate pt="Jogos Únicos Jogados" en="Unique Played Games" />}
            icon={<CatalogIcon />}
            value={currentUser.statistics.uniqueGamesPlayed}
            suffix={`/${availableGamesCount}`}
          />

          <StatisticCard
            title={<Translate pt="Primeiros Lugares" en="Won Games" />}
            value={(currentUser.statistics.win / currentUser.statistics.winnableGames) * 100}
            icon={<TrophyIcon />}
            precision={0}
            suffix="%"
            disabled={!Boolean(currentUser.statistics.winnableGames)}
          />

          <StatisticCard
            title={<Translate pt="Jogos em Último" en="Dead Last" />}
            value={(currentUser.statistics.last / currentUser.statistics.winnableGames) * 100}
            icon={<SkullIcon />}
            precision={0}
            suffix="%"
            disabled={!Boolean(currentUser.statistics.winnableGames)}
          />

          <StatisticCard
            title={<Translate pt="Tempo Jogado" en="Play Duration" />}
            value={durationToHours(currentUser.statistics.totalPlayDuration)}
            icon={<ClockIcon />}
            suffix={<Translate pt="horas" en="hours" />}
          />

          <StatisticCard
            title={<Translate pt="Última Jogada" en="Latest Play" />}
            value={timestampToDate(currentUser.statistics.latestPlay.startedAt)}
            icon={<CalendarIcon />}
          />

          <StatisticCard
            title={<Translate pt="Total de Medalhas" en="Total Achievements" />}
            value={currentUser.statistics.achievements}
            icon={<SealOfApprovalIcon />}
            suffix="/57"
          />
        </Row>

        <Divider />

        <Collapse>
          {games.map((game) => {
            const info = GAME_LIST[game.gameName];
            return (
              <Collapse.Panel header={<DualTranslate>{info.title}</DualTranslate>} key={game.gameName}>
                <GameStatistics key={game.gameName} game={game} info={info} />
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </Layout.Content>
    </Layout>
  );
}

export default Me;
