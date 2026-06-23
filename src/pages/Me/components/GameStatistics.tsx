import { useState } from 'react';
// Ant Design Resources
import { ClockCircleOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Image, Row, Space, Tabs, Typography } from 'antd';
// Types
import type { AchievementReference } from 'types/game';
import type { GameInfo } from 'types/game-info';
import type { GameUserStatistics } from 'types/user';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
import { useLanguage } from '@hooks/useLanguage';
import { useQueryParams } from '@hooks/useQueryParams';
import { useTDBaseUrl } from '@hooks/useTDBaseUrl';
// Utils
import { calculateGameAverageDuration, truncateRecommended } from '@utils/helpers';
// Icons
import { CalendarIcon } from '@icons/CalendarIcon';
import { ClockIcon } from '@icons/ClockIcon';
import { DiceIcon } from '@icons/DiceIcon';
import { MultitaskIcon } from '@icons/MultitaskIcon';
import { PlayersIcon } from '@icons/PlayersIcon';
import { SealOfApprovalIcon } from '@icons/SealOfApprovalIcon';
import { SkullIcon } from '@icons/SkullIcon';
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { IconAvatar } from '@components/avatars/IconAvatar';
import { GameStrip, GameBanner } from '@components/general/GameBanner';
import { GameTags } from '@components/general/GameTags';
import { GameVideo } from '@components/general/GameVideo';
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { Title } from '@components/text/Title';
// Internal
import { formatDurationToHoursAndMinutes, timestampToDate } from '../utils';
import { InfoCard } from './InfoCard';
import { StatisticCard } from './StatisticCard';
import { UserAchievements } from './UserAchievements';

type GameUserStatisticsProps = {
  info: GameInfo;
  game?: GameUserStatistics;
  achievements?: AchievementReference | null;
};

const leftColProps = { xs: 24, sm: 24, md: 24, lg: 24 };

export function GameStatistics({ game, info, achievements }: GameUserStatisticsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { queryParams, addParam } = useQueryParams();
  const activeTab = queryParams.get('tab');

  const duration = calculateGameAverageDuration(info);

  return (
    <Row gutter={8}>
      <Col
        xs={24}
        sm={8}
        md={8}
        lg={6}
      >
        <Col
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered ? (
            <GameVideo
              title={info.title}
              gameName={info.gameName}
              className="me__game-banner"
              width={256}
            />
          ) : (
            <GameStrip
              title={info.title}
              gameName={info.gameName}
              className="me__game-banner"
              width={256}
              stripWidth={256}
            />
          )}
        </Col>
        <InfoCard
          title={
            <Translate
              pt="Nome"
              en="Name"
            />
          }
          {...leftColProps}
        >
          <DualTranslate>{info.title}</DualTranslate>
          {(info.popularName.pt || info.popularName.en) && (
            <>
              <br />
              <span className="italic">
                (<DualTranslate>{info.popularName}</DualTranslate>)
              </span>
            </>
          )}
        </InfoCard>
        <InfoCard
          title={
            <Translate
              pt="Descrição"
              en="Summary"
            />
          }
          {...leftColProps}
        >
          <DualTranslate>{info.summary}</DualTranslate>

          <br />
          <GameTags
            mechanics={info.mechanics}
            gameCode={info.gameCode}
            features={info.features}
          />
        </InfoCard>

        <InfoCard
          title={
            <Translate
              pt="Jogadores"
              en="Players"
            />
          }
          {...leftColProps}
        >
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
        <InfoCard
          title={
            <Translate
              pt="Duração"
              en="Duration"
            />
          }
          {...leftColProps}
        >
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
      </Col>

      <Col
        xs={24}
        sm={16}
        md={16}
        lg={18}
      >
        <Tabs
          onChange={(tab) => addParam('tab', tab)}
          activeKey={activeTab ?? 'statistics'}
          type="card"
          items={[
            {
              label: (
                <Translate
                  en="Statistics"
                  pt="Estatísticas"
                />
              ),
              key: 'statistics',
              children: (
                <GamePlayStatistics
                  game={game}
                  achievements={achievements}
                  info={info}
                />
              ),
            },
            {
              label: (
                <Translate
                  en="Achievements"
                  pt="Medalhas"
                />
              ),
              key: 'achievements',
              children: (
                <GameAchievements
                  game={game}
                  achievements={achievements}
                  info={info}
                />
              ),
            },
            {
              label: (
                <Translate
                  en="Rules"
                  pt="Regras"
                />
              ),
              key: 'rules',
              children: (
                <GameRules
                  game={game}
                  achievements={achievements}
                  info={info}
                />
              ),
            },
          ]}
        />
      </Col>
    </Row>
  );
}

function GamePlayStatistics({ game, achievements, info }: GameUserStatisticsProps) {
  const BASE_URL = useTDBaseUrl('assets');
  const cardWidth = useCardWidth(3, { maxWidth: 320, minWidth: 96 });

  const sample = (
    <>
      <Divider />
      <Typography.Title level={5}>
        <Translate
          en="Sample Image"
          pt="Imagem de exemplo"
        />
      </Typography.Title>

      <Image
        src={`${BASE_URL}/examples/${info.gameName}.jpg`}
        width={cardWidth}
        className="border-radius"
        fallback={`${BASE_URL}/rules/no-rules.jpg`}
      />
    </>
  );

  if (!game) {
    return (
      <div className="me-modal__no-plays">
        <IconAvatar
          icon={<MultitaskIcon />}
          size={75}
        />
        <Translate
          pt="Você ainda não jogou esse jogo"
          en="You haven't played this game yet"
        />
        {sample}
      </div>
    );
  }

  return (
    <Row gutter={8}>
      <StatisticCard
        title={
          <Translate
            pt="Total de Partidas"
            en="Total Plays"
          />
        }
        icon={<DiceIcon />}
        value={game.plays}
      />

      {game.isWinnable && (
        <StatisticCard
          title={
            <Translate
              pt="Vitórias"
              en="Victories"
            />
          }
          value={(game.win / game.plays) * 100}
          icon={<TrophyIcon />}
          precision={0}
          suffix="%"
          disabled={!game.plays}
        />
      )}

      {game.isWinnable && info.mechanics.includes('competitive') && (
        <StatisticCard
          title={
            <Translate
              pt="Partidas em Último"
              en="Dead Last"
            />
          }
          value={(game.last / game.plays) * 100}
          icon={<SkullIcon />}
          precision={0}
          suffix="%"
          disabled={!game.plays}
        />
      )}

      <StatisticCard
        title={
          <Translate
            pt="Tempo Jogado"
            en="Play Duration"
          />
        }
        value={formatDurationToHoursAndMinutes(game.totalPlayDuration)}
        icon={<ClockIcon />}
      />

      <StatisticCard
        title={
          <Translate
            pt="Partida Mais Recente"
            en="Latest Play"
          />
        }
        value={timestampToDate(game.latestPlay.startedAt)}
        icon={<CalendarIcon />}
      />

      <StatisticCard
        title={
          <Translate
            pt="Primeira Partida"
            en="First Play"
          />
        }
        value={timestampToDate(game.firstPlay.startedAt)}
        icon={<CalendarIcon />}
      />

      <StatisticCard
        title={
          <Translate
            pt="Média de Jogadores"
            en="Average Player Count"
          />
        }
        value={game.averagePlayerCount}
        icon={<PlayersIcon />}
        suffix={
          <Translate
            pt="jogadores"
            en="players"
          />
        }
        precision={0}
      />

      {Boolean(achievements) && (
        <StatisticCard
          title={
            <Translate
              pt="Total de Medalhas"
              en="Total Achievements"
            />
          }
          value={Object.keys(game.achievements).length}
          icon={<SealOfApprovalIcon />}
          suffix={`/${Object.keys(achievements ?? {}).length}`}
        />
      )}

      {sample}
    </Row>
  );
}

function GameAchievements({ game, achievements }: GameUserStatisticsProps) {
  if (!achievements) {
    return (
      <div className="me-modal__no-achievements">
        <IconAvatar
          icon={<SkullIcon />}
          size={75}
        />
        <Translate
          pt="Nenhuma medalha disponível para esse jogo"
          en="No achievements available for this game"
        />
      </div>
    );
  }

  return (
    <>
      <Title
        level={4}
        size="xx-small"
      >
        <Translate
          pt="Medalhas"
          en="Achievements"
        />
      </Title>
      <UserAchievements
        reference={achievements ?? {}}
        achievements={game?.achievements ?? {}}
      />
    </>
  );
}

function GameRules({ info }: GameUserStatisticsProps) {
  const BASE_URL = useTDBaseUrl('assets');
  const { language } = useLanguage();
  const cardWidth = useCardWidth(6, { maxWidth: 300, minWidth: 96 });
  return (
    <div className="me-modal__rules">
      <Image.PreviewGroup
        fallback={`${BASE_URL}/rules/no-rules.jpg`}
        preview={{
          countRender: (current, total) => (
            <Space
              orientation="vertical"
              size="small"
              className="text-center"
            >
              <span>{info.rules[language][current]}</span>
              <span>
                {current}/{total}
              </span>
            </Space>
          ),
        }}
      >
        <ul className="me-modal__rules-list">
          {info.rules[language].map((rule, index) => (
            <Card key={rule}>
              {index === 0 ? (
                <GameBanner
                  gameName={info.gameName}
                  width={cardWidth}
                  className="border-radius"
                  showLogo={false}
                />
              ) : (
                <Image
                  src={`${BASE_URL}/rules/${info.gameName}/${index}.jpg`}
                  width={cardWidth}
                  className="border-radius"
                  fallback={`${BASE_URL}/rules/no-rules.jpg`}
                />
              )}
              <Typography.Paragraph style={{ marginBottom: 0 }}>{rule}</Typography.Paragraph>
            </Card>
          ))}
        </ul>
      </Image.PreviewGroup>
    </div>
  );
}
