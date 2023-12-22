import { useMemo } from 'react';
import { memoize } from 'lodash';
// Ant Design Resources
import { Button, Space } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
// Utils
import { sortPlayers } from 'utils/helpers';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
import { useCountdown } from 'hooks/useCountdown';
import { useDimensions } from 'hooks/useDimensions';
import { useColorizeBackground } from './utils/useColorizeBackground';
// Icons
import { DJIcon } from 'icons/DJIcon';
import { GarbageIcon } from 'icons/GarbageIcon';
import { VIPLineIcon } from 'icons/VIPLineIcon';
// Components
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { TimedButton } from 'components/buttons';
import { ClubberAvatar } from '../../components/avatars/ClubberAvatar';
import { IconAvatar } from 'components/avatars';
import { ResultValueDelegator } from './components/ResultValueDelegator';
import { TrackTitle } from './components/TrackTitle';
import { VotesDelegator } from './components/VotesDelegator';

type StepResultProps = {
  user: GamePlayer;
  players: GamePlayers;
  onSeeRanking: GenericFunction;
  round: GameRound;
  isFirstRunThrough: boolean;
  track: Track;
  winningValues: string[];
  winningTeam: PlayerId[];
  scoringType: string;
} & AnnouncementProps;

export function StepResult({
  user,
  players,
  onSeeRanking,
  round,
  isFirstRunThrough,
  announcement,
  track,
  winningValues,
  winningTeam,
  scoringType,
}: StepResultProps) {
  useTemporarilyHidePlayersBar();
  const [width] = useDimensions('results');

  const time = useCountdown({ duration: 20 });

  const playersList = useMemo(() => sortPlayers(players), [players]);

  const currentIndex = time.timeLeft > 14 ? round.current - 1 : round.current;

  // Dynamic background
  useColorizeBackground(user, time.timeLeft > 13 ? round.current : round.current + 1);

  // Counts to aid the animation positioning. It doesn't trigger re-renders because it's handled by css
  let winningCount = 0;
  let losingCount = 0;

  return (
    <Step announcement={announcement}>
      <Title size="small" white>
        <Translate pt="Resultado" en="Results" />: <TrackTitle track={track} />
      </Title>

      <RuleInstruction type="event">
        <IconAvatar icon={<DJIcon />} size="large" />
        {scoringType === 'NORMAL' && (
          <Translate
            pt={<>Jogadores que votaram com a maioria entram ou continuam na Área VIP.</>}
            en={<>Players who voted with the majority join or stay in the VIP area.</>}
          />
        )}
        {scoringType === 'TIE' && (
          <Translate
            pt={<>Empate entre 2 ou mais respostas. Quem já estava na Área VIP fica e ganha ponto.</>}
            en={
              <>
                It's a tie for 2 or more answers. Whoever was already in the VIP Area stays there and get
                points.
              </>
            }
          />
        )}
        {scoringType === 'DRAW' && (
          <Translate
            pt={<>Cada um escolheu uma coisa diferente? Todo mundo fora da Área VIP!</>}
            en={<>Did everybody just choose something different? Everybody out!</>}
          />
        )}
      </RuleInstruction>

      <div className="results" id="results">
        <div className="results__vip" id="area-w">
          <span className="results__icon">
            <IconAvatar icon={<VIPLineIcon />} size="large" />
          </span>
          <span className="results__label">
            <Translate pt="Área VIP" en="VIP Lounge" />
          </span>
        </div>
        <div className="results__values" id="results-values">
          <ResultValueDelegator
            track={track}
            winningValues={winningValues}
            players={players}
            winningTeam={winningTeam}
            playersList={playersList}
          />
        </div>
        <div className="results__gutter" id="area-l">
          <span className="results__icon">
            <IconAvatar icon={<GarbageIcon />} size="large" />
          </span>
          <span className="results__label">
            <Translate pt="Pista (Sarjeta)" en="GA (Scum)" />
          </span>
        </div>

        {playersList.map((player, index) => {
          const isWinningArea = player.team[currentIndex] === 'W';
          winningCount = isWinningArea ? winningCount + 1 : winningCount;
          losingCount = !isWinningArea ? losingCount + 1 : losingCount;

          return (
            <div
              className="results__player"
              key={`${player.id}-${player.clubberId}`}
              style={getPosition(isWinningArea ? winningCount : losingCount, isWinningArea ? 0 : 1, width)}
            >
              <ClubberAvatar
                avatarId={player.avatarId}
                id={player.clubberId}
                width={45}
                animate={isWinningArea}
              />
              <span className="results__player-name">{player.name}</span>
            </div>
          );
        })}
      </div>

      <Space className="space-container" align="center">
        {isFirstRunThrough ? (
          <TimedButton onClick={onSeeRanking} onExpire={onSeeRanking} duration={20} icon={<TrophyOutlined />}>
            <Translate pt="Ver Ranking" en="See Ranking" />
          </TimedButton>
        ) : (
          <Button onClick={onSeeRanking} icon={<TrophyOutlined />}>
            <Translate pt="Ver Ranking" en="See Ranking" />
          </Button>
        )}
      </Space>

      <VotesDelegator
        track={track}
        winningValues={winningValues}
        players={players}
        winningTeam={winningTeam}
      />
    </Step>
  );
}

const getPosition = memoize(
  (index: number, side: number, width: number) => {
    const areaSize = width / 3;
    const buffer = side * areaSize * 2;

    const getTopValue = (index: number, startAt: number, increment: number): number => {
      const ratio = [0, 0, 0, 1, 1, 1, 1];
      const multiplier = Math.floor(index / ratio.length);
      const remainderPosition = index % ratio.length;

      return startAt + multiplier * increment + (ratio[remainderPosition] + multiplier) * increment;
    };
    const top = getTopValue(index, 0, 45);

    const left = [0.24, 0.48, 0.72, 0.15, 0.36, 0.6, 0.84][index % 7];

    return {
      top: `${50 + top}px`,
      left: `${areaSize * left + buffer}px`,
    };
  },
  (index, side, width) => `${index}-${side}-${width}`
);
