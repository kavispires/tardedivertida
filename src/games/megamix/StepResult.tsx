import { useMemo } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
// Utils
import { sortPlayers } from 'utils/helpers';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
import { useCountdown } from 'hooks/useCountdown';
import { useDimensions } from 'hooks/useDimensions';
// Icons
import { DJIcon } from 'icons/DJIcon';
import { GarbageIcon } from 'icons/GarbageIcon';
import { VIPLineIcon } from 'icons/VIPLineIcon';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { TimedButton } from 'components/buttons';
import { ClubberAvatar } from './components/ClubberAvatar';
import { IconAvatar } from 'components/avatars';
import { ResultValueDelegator } from './components/ResultValueDelegator';
import { TaskTitle } from './components/TaskTitle';
import { VotesDelegator } from './components/VotesDelegator';

type StepResultProps = {
  user: GamePlayer;
  players: GamePlayers;
  onSeeRanking: GenericFunction;
  round: GameRound;
  isFirstRunThrough: boolean;
  task: Task;
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
  task,
  winningValues,
  winningTeam,
  scoringType,
}: StepResultProps) {
  useTemporarilyHidePlayersBar();
  const [width, height] = useDimensions('results');

  const time = useCountdown({ duration: 20 });

  const playersList = useMemo(() => sortPlayers(players), [players]);

  const currentIndex = time.timeLeft > 14 ? round.current - 1 : round.current;

  return (
    <Step announcement={announcement}>
      <Title size="small">
        <Translate pt="Resultado" en="Results" />: <TaskTitle task={task} />
      </Title>

      <Instruction contained>
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
      </Instruction>

      <div className="results" id="results">
        <div className="results__vip">
          <span className="results__icon">
            <IconAvatar icon={<VIPLineIcon />} size="large" />
          </span>
          <span className="results__label">
            <Translate pt="Área VIP" en="VIP Lounge" />
          </span>
        </div>
        <div className="results__values" id="results-values">
          <ResultValueDelegator
            task={task}
            winningValues={winningValues}
            players={players}
            winningTeam={winningTeam}
          />
        </div>
        <div className="results__gutter">
          <span className="results__icon">
            <IconAvatar icon={<GarbageIcon />} size="large" />
          </span>
          <span className="results__label">
            <Translate pt="Pista (Sarjeta)" en="GA (Scum)" />
          </span>
        </div>

        {playersList.map((player, index) => (
          <div
            className="results__player"
            key={`${player.id}-${player.clubberId}`}
            style={getPosition(index, player.team[currentIndex] === 'W' ? 0 : 1, width, height)}
          >
            <ClubberAvatar
              id={player.avatarId}
              clubberId={player.clubberId}
              width={45}
              animate={player.team[currentIndex] === 'W'}
            />
            <span className="results__player-name">{player.name}</span>
          </div>
        ))}
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

      <VotesDelegator task={task} winningValues={winningValues} players={players} winningTeam={winningTeam} />
    </Step>
  );
}

const getPosition = (index: number, side: number, width: number, height: number) => {
  const area = width / 3;
  const buffer = side * area * 2;

  const top =
    {
      0: 0,
      1: 0,
      2: 0,
      3: 50,
      4: 50,
      5: 100,
      6: 100,
      7: 100,
      8: 150,
      9: 150,
    }[index] || 10;

  const left = [0.2, 0.5, 0.8, 0.33, 0.66][index % 5];

  return {
    top: `${75 + top}px`,
    left: `${area * left + buffer}px`,
  };
};
