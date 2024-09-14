import clsx from 'clsx';
import { orderBy } from 'lodash';
// Ant Design Resources
import { CheckSquareFilled, CloseSquareFilled, TrophyOutlined } from '@ant-design/icons';
import { Space, Table } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { AVATARS as avatars } from 'utils/avatars';
import { getMeanDuration } from 'utils/helpers';
// Components
import { AvatarName } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import type { Clue, Grid, GridType } from './utils/types';
import { WordGrid } from './components/WordGrid';
import { ClueCard } from './components/ClueCard';
import { PreviousClue } from './components/PreviousClue';
import { ScoringRule } from './components/RulesBlobs';
//Design Resources

const AVATARS: PlainObject = avatars;

type PlayersInCellProps = {
  cellPlayers: {
    playerId: PlayerId;
    isCorrect?: boolean;
    color?: string;
  }[];
  players: GamePlayers;
};

function PlayersInCell({ cellPlayers, players }: PlayersInCellProps) {
  return (
    <ul>
      {cellPlayers.map(({ playerId, isCorrect }: any) =>
        isCorrect ? (
          <li
            key={`players-in-cell-${playerId}`}
            className={clsx(isCorrect && 'x-players-in-cell-player--correct')}
          >
            <AvatarName player={players[playerId]} size="small" />
          </li>
        ) : undefined
      )}
    </ul>
  );
}

type ResultCellProps = {
  cell: any;
  clues: Clue[];
  players: GamePlayers;
  playerPerVotedCell: any;
  colorCodedCluesPerPlayer: any;
};

function ResultCell({ cell, clues, players, playerPerVotedCell, colorCodedCluesPerPlayer }: ResultCellProps) {
  const clue = clues.find((c) => c.coordinate === cell.index);
  const cellPlayers = playerPerVotedCell[cell.index] ?? [];

  if (clue) {
    return (
      <div>
        <ClueCard
          isMatched
          clue={clue.clue}
          color={colorCodedCluesPerPlayer[clue.playerId!]}
          player={players[clue.playerId!]}
        />
        {Boolean(cellPlayers.length) && <PlayersInCell cellPlayers={cellPlayers} players={players} />}
      </div>
    );
  }

  if (cell.text) {
    return <PreviousClue clue={cell.text} />;
  }

  return (
    <span>
      {Boolean(cellPlayers.length) && <PlayersInCell cellPlayers={cellPlayers} players={players} />}
    </span>
  );
}

type AnswersListProps = {
  players: GamePlayers;
  grid: Grid;
  correctCoordinatesPerPlayer: any;
};

function AnswersList({ players, grid, correctCoordinatesPerPlayer }: AnswersListProps) {
  const { translate } = useLanguage();

  const columns = [
    {
      title: translate('Jogador', 'Player'),
      dataIndex: 'player',
      key: 'player',
      render: (data: any) => <AvatarName player={data} />,
      sorter: (a: any, b: any) => a.playerName.localeCompare(b.playerName),
    },
    {
      title: translate('Achou que', 'Thought that'),
      dataIndex: 'guess',
      key: 'guess',
      render: (guess: string) => guess.toUpperCase(),
      sorter: (a: any, b: any) => a.guess.localeCompare(b.guess),
    },
    {
      title: translate('Era', 'Was'),
      dataIndex: 'clue',
      key: 'clue',
      render: (clue: string) => clue.toUpperCase(),
      sorter: (a: any, b: any) => a.clue.localeCompare(b.clue),
    },
    {
      title: translate('Resultado', 'Result'),
      dataIndex: 'result',
      key: 'result',
      render: (value: any) =>
        value ? (
          <CheckSquareFilled style={{ color: 'green' }} />
        ) : (
          <CloseSquareFilled style={{ color: 'red' }} />
        ),
      sorter: (a: any, b: any) => (a.result === true ? 1 : -1),
    },
  ];

  const parsedData = Object.values(players).map((player) => {
    return Object.entries(player?.guesses ?? {}).reduce(
      (acc: PlainObject, [guessedPlayerId, guessedCoordinate]: any) => {
        if (guessedPlayerId === player.id) return acc;

        const cell = grid[guessedCoordinate];

        acc.push({
          playerName: player.name,
          player,
          clue: `${cell.yText} + ${cell.xText}`,
          guess: players[guessedPlayerId].clue,
          result: correctCoordinatesPerPlayer?.[guessedCoordinate] === guessedPlayerId,
        });

        return acc;
      },
      []
    );
  });

  const dataSource: any = orderBy(parsedData.flat(), ['playerName', 'guess'], ['asc', 'asc']);

  return <Table size="small" columns={columns} dataSource={dataSource} pagination={false} />;
}

type BadCluesPlayersListProps = {
  badCluesPlayersList: GamePlayer[];
};

function BadCluesPlayersList({ badCluesPlayersList }: BadCluesPlayersListProps) {
  return (
    <span>
      {badCluesPlayersList.map((player, index) => (
        <span key={`bad-clue-${player.id}-${index}`}>
          <AvatarName player={player} key={`bad-clue-${player.id}`} size="small" />
          {badCluesPlayersList.length > 0 && index < badCluesPlayersList.length - 1 ? ', ' : ''}
        </span>
      ))}
    </span>
  );
}

type StepRevealProps = {
  players: GamePlayers;
  grid: Grid;
  gridType: GridType;
  user: GamePlayer;
  clues: Clue[];
  goToNextStep: UseStep['goToNextStep'];
  whoGotNoPoints: PlayerId[];
} & Pick<StepProps, 'announcement'>;

export function StepReveal({
  grid,
  gridType,
  user,
  players,
  clues,
  goToNextStep,
  whoGotNoPoints,
  announcement,
}: StepRevealProps) {
  useTemporarilyHidePlayersBar();
  const correctCoordinatesPerPlayer = clues.reduce((acc: PlainObject, clue) => {
    acc[clue.coordinate] = clue.playerId;
    return acc;
  }, {});

  const colorCodedCluesPerPlayer = clues.reduce((acc: PlainObject, clue) => {
    acc[clue.playerId!] = AVATARS[players[clue.playerId!].avatarId].color;
    return acc;
  }, {});

  const playerPerVotedCell = Object.values(players).reduce((acc: PlainObject, player) => {
    Object.entries(player.guesses ?? {}).forEach(([playerId, coordinate]: any) => {
      if (playerId !== player.id) {
        if (acc[coordinate] === undefined) {
          acc[coordinate] = [];
        }
        acc[coordinate].push({
          playerId: player.id,
          color: colorCodedCluesPerPlayer[playerId],
          isCorrect: correctCoordinatesPerPlayer[coordinate] === playerId,
        });
      }
    });

    return acc;
  }, {});

  const whoGotNoPointsNames = whoGotNoPoints.map((playerId) => players[playerId]);
  const playerCount = Object.keys(players).length;

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt="Resultado" en="Results" />
      </Title>

      <PopoverRule content={<ScoringRule playerCount={playerCount} />} />

      {Boolean(whoGotNoPoints.length) && (
        <RuleInstruction type="alert">
          <Translate
            pt={
              <>
                Ninguém acertou a(s) dica(s) dadas por
                <BadCluesPlayersList badCluesPlayersList={whoGotNoPointsNames} />, então ele(s) perde(m){' '}
                <PointsHighlight type="negative">- {playerCount}</PointsHighlight> pontos.
              </>
            }
            en={
              <>
                Nobody got the clues given by
                <BadCluesPlayersList badCluesPlayersList={whoGotNoPointsNames} />, so they lose{' '}
                <PointsHighlight type="negative">- {playerCount}</PointsHighlight> points.
              </>
            }
          />
        </RuleInstruction>
      )}

      <WordGrid
        grid={grid}
        gridType={gridType}
        user={user}
        CellComponent={ResultCell}
        cellComponentProps={{ clues, players, playerPerVotedCell, colorCodedCluesPerPlayer }}
      />

      <Space className="space-container" align="center">
        <TimedButton
          duration={getMeanDuration(playerCount, 6, 40, 15) + 5}
          icon={<TrophyOutlined />}
          onExpire={goToNextStep}
          onClick={goToNextStep}
        >
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Space>

      <Title level={3} size="x-small">
        <Translate pt="Todas as respostas" en="All Answers" />
      </Title>
      <AnswersList correctCoordinatesPerPlayer={correctCoordinatesPerPlayer} players={players} grid={grid} />
    </Step>
  );
}
