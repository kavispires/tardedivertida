// Ant Design Resources
import { Col, Divider, Rate, Row } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
// Types
import type { GameInfo } from 'types/game-info';
import type { GameUserStatistics } from 'types/user';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { durationToHours, timestampToDate } from '../utils';
import { calculateGameAverageDuration, truncateRecommended } from 'utils/helpers';
// Icons
import { PlayersIcon } from 'icons/PlayersIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
import { SkullIcon } from 'icons/SkullIcon';
import { ClockIcon } from 'icons/ClockIcon';
import { DiceIcon } from 'icons/DiceIcon';
import { CalendarIcon } from 'icons/CalendarIcon';
import { SealOfApprovalIcon } from 'icons/SealOfApprovalIcon';
import { MultitaskIcon } from 'icons/MultitaskIcon';
// Components
import { GameBanner } from 'components/general/GameBanner';
import { DualTranslate, Translate } from 'components/language';
import { RulesModal } from 'components/rules';
import { IconAvatar } from 'components/avatars';
import { InfoCard } from './InfoCard';
import { StatisticCard } from './StatisticCard';
import { UserAchievements } from './UserAchievements';

import { Title } from 'components/text';

type GameUserStatisticsProps = {
  info: GameInfo;
  game?: GameUserStatistics;
  achievements?: AchievementReference | null;
};

const leftColProps = { xs: 24, sm: 24, md: 24, lg: 24 };

export function GameStatistics({ game, info, achievements }: GameUserStatisticsProps) {
  const { language } = useLanguage();

  const duration = calculateGameAverageDuration(info);

  return (
    <>
      <Row gutter={8}>
        <Col xs={24} sm={8} md={8} lg={6}>
          {/* <Row gutter={8}> */}
          <Col>
            <GameBanner title={info.title} gameName={info.gameName} className="me__game-banner" />
          </Col>
          <InfoCard title={<Translate pt="Nome" en="Name" />} {...leftColProps}>
            <DualTranslate>{info.title}</DualTranslate>
            <br />
            <span className="italic">
              (<DualTranslate>{info.popularName}</DualTranslate>)
            </span>
          </InfoCard>
          <InfoCard title={<Translate pt="Descrição" en="Summary" />} {...leftColProps}>
            <DualTranslate>{info.summary}</DualTranslate>
            <br />
            {Boolean(info.rules?.[language]?.length > 1) && (
              <RulesModal gameInfo={info} buttonProps={{ size: 'small' }} />
            )}
          </InfoCard>
          <InfoCard title={<Translate pt="Sua avaliação" en="Your Rating" />} {...leftColProps}>
            <Rate value={game?.rating} />
          </InfoCard>
          <InfoCard title={<Translate pt="Jogadores" en="Players" />} {...leftColProps}>
            <Translate
              pt={
                <>
                  Para {info.playerCount.min}-{info.playerCount.max} jogadores
                  <br />
                  Melhor com {info.playerCount.best || '?'} jogadores
                  <br />
                  Recomendado jogar com {truncateRecommended(info.playerCount.recommended)}
                </>
              }
              en={
                <>
                  For {info.playerCount.min}-{info.playerCount.max} players
                  <br />
                  Best with {info.playerCount.best || '?'} players
                  <br />
                  Recommended to play with {truncateRecommended(info.playerCount.recommended)}
                </>
              }
            />
          </InfoCard>
          <InfoCard title={<Translate pt="Duração" en="Duration" />} {...leftColProps}>
            <Translate
              pt={
                <>
                  <ClockCircleOutlined /> {duration.min} min - {duration.max} min (Md: {duration.ideal} min)
                </>
              }
              en={
                <>
                  <ClockCircleOutlined /> {duration.min} min - {duration.max} min (Avg: {duration.ideal} min)
                </>
              }
            />
          </InfoCard>
          {/* </Row> */}
        </Col>

        <Col xs={24} sm={16} md={16} lg={18}>
          {game ? (
            <Row gutter={8}>
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
          ) : (
            <>
              <div className="me-modal__no-plays">
                <IconAvatar icon={<MultitaskIcon />} size={75} />
                <Translate pt="Você ainda não jogou esse jogo" en="You haven't played this game yet" />
              </div>
              <Divider />
            </>
          )}

          {Boolean(achievements) && (
            <>
              <Title level={4} size="xx-small">
                <Translate pt="Medalhas" en="Achievements" />
              </Title>
              <UserAchievements reference={achievements!} achievements={game?.achievements ?? {}} />
            </>
          )}
        </Col>
      </Row>
    </>
  );
}
