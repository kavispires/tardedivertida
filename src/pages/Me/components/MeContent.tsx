import { orderBy } from "lodash";
import { ReactNode, useMemo, useState } from "react";
// Ant Design Resources
import { Layout, Row, Divider, Space, Switch } from "antd";
// Types
import { Me } from "types/user";
// Hooks
import { useLanguage } from "hooks/useLanguage";
// Utils
import ACHIEVEMENTS_DICT from "utils/achievements";
// Icons
import { CalendarIcon } from "icons/CalendarIcon";
import { CatalogIcon } from "icons/CatalogIcon";
import { ClockIcon } from "icons/ClockIcon";
import { DiceIcon } from "icons/DiceIcon";
import { PlayersIcon } from "icons/PlayersIcon";
import { SealOfApprovalIcon } from "icons/SealOfApprovalIcon";
import { SkullIcon } from "icons/SkullIcon";
import { TrophyIcon } from "icons/TrophyIcon";
import { UserStatsIcon } from "icons/UserStatsIcon";
// Components
import { LogoutButton } from "components/auth/LogoutButton";
import { Avatar, IconAvatar } from "components/avatars";
import { LanguageSwitch, Translate } from "components/language";
import { Title } from "components/text";
// Internal
import {
  availableGamesCount,
  durationToHours,
  playableGames,
  timestampToDate,
} from "../utils";
import { UserName } from "./UserName";
import { StatisticCard } from "./StatisticCard";
import { InfoCard } from "./InfoCard";
import { GameCheckCard } from "./GameCheckCard";
// Sass
import "../Me.scss";

type MeContentProps = {
  user: Me;
  additionalContent: ReactNode;
};

export function MeContent({ user, additionalContent }: MeContentProps) {
  const { language } = useLanguage();

  const alphabetizedPlayableGames = useMemo(
    () => orderBy(Object.values(playableGames), `title.${language}`),
    [language],
  );

  return (
    <Layout className="me__container">
      <Layout.Content className="container me__content">
        {additionalContent}

        <header className="me__header">
          <Title size="small" level={1} align="left">
            <IconAvatar icon={<UserStatsIcon />} size="large" />
            <Translate pt="Página do" en="User Page" />{" "}
            <UserName names={user.names} />
          </Title>
          <Space>
            <LanguageSwitch />
            <LogoutButton key="logout-button" danger ghost size="small" />
          </Space>
        </header>

        <Row gutter={8}>
          <InfoCard title={<Translate pt="Nomes usados" en="Used Names" />}>
            {user.names.join(", ")}
          </InfoCard>

          <InfoCard
            title={<Translate pt="Avatares preferidos" en="Favorite Avatars" />}
          >
            {user.avatars.map((avatarId) => (
              <Avatar
                key={avatarId}
                id={avatarId}
                shape="square"
                size="small"
              />
            ))}
          </InfoCard>

          {/* {Boolean(user?.daily) && (
            <InfoCard title={<Translate pt="TD Diários" en="Daily TD" />}>
              <Translate pt="Vitórias" en="Streak" />: {user.daily?.streak} / Total: {user.daily?.total}
            </InfoCard>
          )} */}
        </Row>

        <Divider />

        <Summary user={user} />

        <Title size="x-small" level={2} align="left">
          <Translate pt="Jogos" en="Games" /> (
          {alphabetizedPlayableGames.length})
        </Title>

        <GameCheckCard info={alphabetizedPlayableGames} games={user.games} />
      </Layout.Content>
    </Layout>
  );
}

function Summary({ user }: Pick<MeContentProps, "user">) {
  const [today, setToday] = useState(false);
  // Count achievable achievements only from the games the user has played
  const achievementsCount = useMemo(() => {
    return Object.entries(ACHIEVEMENTS_DICT).reduce(
      (acc, [gameName, references]) => {
        if (references && user.games?.[gameName]) {
          return acc + Object.keys(references).length;
        }
        return acc;
      },
      0,
    );
  }, [user.games]);

  return (
    <>
      <Title size="x-small" level={1} align="left">
        <Translate pt="Sumário" en="Summary" />{" "}
        {user.today.plays > 0 && (
          <Switch
            checkedChildren={<Translate pt="Mostrar Todas" en="Show All" />}
            unCheckedChildren={<Translate pt="Mostrar Hoje" en="Show Today" />}
            onChange={() => setToday(!today)}
          />
        )}
      </Title>

      <Row gutter={8}>
        <StatisticCard
          title={<Translate pt="Total de Partidas" en="Total Plays" />}
          icon={<DiceIcon />}
          value={today ? user.today.plays : user.statistics.plays}
        />

        {!today && (
          <StatisticCard
            title={<Translate pt="Jogos" en="Played Games" />}
            icon={<CatalogIcon />}
            value={user.statistics.uniqueGamesPlayed}
            suffix={`/${availableGamesCount}`}
          />
        )}

        <StatisticCard
          title={<Translate pt="Vitórias" en="Victories" />}
          value={
            today
              ? user.today.win
              : (user.statistics.win / user.statistics.winnableGames) * 100
          }
          icon={<TrophyIcon />}
          precision={0}
          suffix={today ? "" : "%"}
          disabled={!Boolean(user.statistics.winnableGames)}
        />

        <StatisticCard
          title={<Translate pt="Jogos em Último" en="Dead Last" />}
          value={
            today
              ? user.today.last
              : (user.statistics.last / user.statistics.winnableGames) * 100
          }
          icon={<SkullIcon />}
          precision={0}
          suffix={today ? "" : "%"}
          disabled={!Boolean(user.statistics.winnableGames)}
        />
        {!today && (
          <StatisticCard
            title={<Translate pt="Tempo Jogado" en="Play Duration" />}
            value={durationToHours(user.statistics.totalPlayDuration)}
            icon={<ClockIcon />}
            suffix={<Translate pt="horas" en="hours" />}
            precision={1}
          />
        )}

        {!today && (
          <StatisticCard
            title={<Translate pt="Partida Mais Recente" en="Latest Play" />}
            value={timestampToDate(user.statistics.latestPlay.startedAt)}
            icon={<CalendarIcon />}
          />
        )}

        {!today && (
          <StatisticCard
            title={
              <Translate pt="Média de Jogadores" en="Average Player Count" />
            }
            value={user.statistics.averagePlayerCount}
            icon={<PlayersIcon />}
            precision={1}
            suffix={<Translate pt="jogadores" en="players" />}
          />
        )}

        <StatisticCard
          title={<Translate pt="Total de Medalhas" en="Total Achievements" />}
          value={today ? user.today.achievements : user.statistics.achievements}
          icon={<SealOfApprovalIcon />}
          suffix={today ? "" : `/${achievementsCount}`}
        />
      </Row>

      <Divider />
    </>
  );
}
