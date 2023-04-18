import { Col, Rate, Row } from 'antd';
import { GameBanner } from 'components/general/GameBanner';
import { DualTranslate, Translate } from 'components/language';
import { InfoCard } from './InfoCard';
import { StatisticCard } from './StatisticCard';
import { TrophyIcon } from 'icons/TrophyIcon';
import { SkullIcon } from 'icons/SkullIcon';
import { durationToHours, timestampToDate } from '../utils';
import { ClockIcon } from 'icons/ClockIcon';
import { SealOfApprovalIcon } from 'icons/SealOfApprovalIcon';
import { DiceIcon } from 'icons/DiceIcon';

type GameUserStatisticsProps = {
  game: GameUserStatistics;
  info: GameInfo;
};

const leftColProps = { xs: 24, sm: 24, md: 24, lg: 24 };

export function GameStatistics({ game, info }: GameUserStatisticsProps) {
  console.log({ game, info });
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
          {/* </Row> */}
        </Col>
        <Col xs={24} sm={16} md={16} lg={18}>
          <Row gutter={8}>
            <InfoCard title={<Translate pt="Nome Popular" en="Popular Name" />}>
              <DualTranslate>{info.popularName}</DualTranslate>
            </InfoCard>

            <InfoCard title={<Translate pt="Sua avaliação" en="Your Rating" />}>
              <Rate value={game.rating} />
            </InfoCard>

            <StatisticCard
              title={<Translate pt="Total de Jogadas" en="Total Sessions" />}
              icon={<DiceIcon />}
              value={game.plays}
            />

            {game.isWinnable && (
              <StatisticCard
                title={<Translate pt="Primeiros Lugares" en="Won Games" />}
                value={(game.win / game.plays) * 100}
                icon={<TrophyIcon />}
                precision={0}
                suffix="%"
                disabled={!Boolean(game.plays)}
              />
            )}

            {game.isWinnable && (
              <StatisticCard
                title={<Translate pt="Jogos em Último" en="Dead Last" />}
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
            />

            <StatisticCard
              title={<Translate pt="Última Jogada" en="Latest Play" />}
              value={timestampToDate(game.latestPlay.startedAt)}
              icon={<SealOfApprovalIcon />}
            />

            <StatisticCard
              title={<Translate pt="Primeira Jogada" en="First Play" />}
              value={timestampToDate(game.firstPlay.startedAt)}
              icon={<SealOfApprovalIcon />}
            />

            {/* <StatisticCard
              title={<Translate pt="Total de Medalhas" en="Total Achievements" />}
              value={currentUser.statistics.achievements}
              icon={<SealOfApprovalIcon />}
              suffix="/57"
            /> */}
          </Row>
        </Col>
      </Row>
    </>
  );
}
