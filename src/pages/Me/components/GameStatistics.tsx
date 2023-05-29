// Ant Design Resources
import { Col, Rate, Row } from 'antd';
// Utils
import { durationToHours, timestampToDate } from '../utils';
// Icons
import { PlayersIcon } from 'icons/PlayersIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
import { SkullIcon } from 'icons/SkullIcon';
import { ClockIcon } from 'icons/ClockIcon';
import { DiceIcon } from 'icons/DiceIcon';
import { CalendarIcon } from 'icons/CalendarIcon';
import { SealOfApprovalIcon } from 'icons/SealOfApprovalIcon';
// Components
import { GameBanner } from 'components/general/GameBanner';
import { DualTranslate, Translate } from 'components/language';
import { InfoCard } from './InfoCard';
import { StatisticCard } from './StatisticCard';
import { UserAchievements } from './UserAchievements';

type GameUserStatisticsProps = {
  game: GameUserStatistics;
  info: GameInfo;
  achievements?: AchievementReference | null;
};

const leftColProps = { xs: 24, sm: 24, md: 24, lg: 24 };

export function GameStatistics({ game, info, achievements }: GameUserStatisticsProps) {
  return (
    <>
      <Row gutter={8}>
        <Col xs={24} sm={8} md={8} lg={6}>
          {/* <Row gutter={8}> */}
          <Col>
            <GameBanner title={info.title} gameName={game.gameName} className="me__game-banner" />
          </Col>
          <InfoCard title={<Translate pt="Descrição" en="Summary" />} {...leftColProps}>
            <DualTranslate>{info.summary}</DualTranslate>
          </InfoCard>
          <InfoCard title={<Translate pt="Sua avaliação" en="Your Rating" />} {...leftColProps}>
            <Rate value={game.rating} />
          </InfoCard>
          {/* </Row> */}
        </Col>
        <Col xs={24} sm={16} md={16} lg={18}>
          <Row gutter={8}>
            <InfoCard title={<Translate pt="Nome Popular" en="Popular Name" />}>
              <DualTranslate>{info.popularName}</DualTranslate>
            </InfoCard>

            <StatisticCard
              title={<Translate pt="Total de Partidas" en="Total Plays" />}
              icon={<DiceIcon />}
              value={game.plays}
            />

            {game.isWinnable && (
              <StatisticCard
                title={<Translate pt="Vitórias" en="Victories" />}
                value={(game.win / game.plays) * 100}
                icon={<TrophyIcon />}
                precision={0}
                suffix="%"
                disabled={!Boolean(game.plays)}
              />
            )}

            {game.isWinnable && info.tags.includes('competitive') && (
              <StatisticCard
                title={<Translate pt="Partidas em Último" en="Dead Last" />}
                value={(game.last / game.plays) * 100}
                icon={<SkullIcon />}
                precision={0}
                suffix="%"
                disabled={!Boolean(game.plays)}
              />
            )}

            <StatisticCard
              title={<Translate pt="Tempo Jogado" en="Play Duration" />}
              value={durationToHours(game.totalPlayDuration)}
              icon={<ClockIcon />}
              suffix={<Translate pt="horas" en="hours" />}
              precision={1}
            />

            <StatisticCard
              title={<Translate pt="Partida Mais Recente" en="Latest Play" />}
              value={timestampToDate(game.latestPlay.startedAt)}
              icon={<CalendarIcon />}
            />

            <StatisticCard
              title={<Translate pt="Primeira Partida" en="First Play" />}
              value={timestampToDate(game.firstPlay.startedAt)}
              icon={<CalendarIcon />}
            />

            <StatisticCard
              title={<Translate pt="Média de Jogadores" en="Average Player Count" />}
              value={game.averagePlayerCount}
              icon={<PlayersIcon />}
              suffix={<Translate pt="jogadores" en="players" />}
              precision={0}
            />

            {Boolean(achievements) && (
              <StatisticCard
                title={<Translate pt="Total de Medalhas" en="Total Achievements" />}
                value={Object.keys(game.achievements).length}
                icon={<SealOfApprovalIcon />}
                suffix={`/${Object.keys(achievements!).length}`}
              />
            )}
          </Row>

          {Boolean(achievements) && (
            <UserAchievements reference={achievements!} achievements={game.achievements} />
          )}
        </Col>
      </Row>
    </>
  );
}
