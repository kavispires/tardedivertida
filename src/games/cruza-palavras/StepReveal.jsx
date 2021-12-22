import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
//Design Resources
import { CheckSquareFilled, CloseSquareFilled, WarningOutlined } from '@ant-design/icons';
// Components
import {
  ButtonContainer,
  Instruction,
  TimedButton,
  Title,
  translate,
  Translate,
} from '../../components/shared';
import WordGrid from './WordGrid';
import ClueCard from './ClueCard';
import { AvatarName } from '../../components/avatars';
import PreviousClue from './PreviousClue';
import { AVATARS } from '../../utils/constants';
import clsx from 'clsx';
import { Table } from 'antd';
import { useLanguage } from '../../hooks';

function PlayersInCell({ cellPlayers, players }) {
  return (
    <ul>
      {cellPlayers.map(({ playerId, color, isCorrect }) =>
        isCorrect ? (
          <li className={clsx(isCorrect && 'x-players-in-cell-player--correct')}>
            <AvatarName player={players[playerId]} size="small" />
          </li>
        ) : (
          <></>
        )
      )}
    </ul>
  );
}

function ResultCell({ cell, clues, players, playerPerVotedCell, colorCodedCluesPerPlayer }) {
  const clue = clues.find((c) => c.coordinate === cell.index);
  const cellPlayers = playerPerVotedCell[cell.index] ?? [];

  if (clue) {
    return (
      <div>
        <ClueCard
          isMatched
          clue={clue.clue}
          color={colorCodedCluesPerPlayer[clue.playerId]}
          player={players[clue.playerId]}
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
      {Boolean(cellPlayers.length) && (
        <PlayersInCell cellPlayers={cellPlayers} players={players} shouldColor />
      )}
    </span>
  );
}

function AnswersList({ players, grid, correctCoordinatesPerPlayer }) {
  const language = useLanguage();

  const columns = [
    {
      title: translate('Jogador', 'Player', language),
      dataIndex: 'player',
      key: 'player',
      render: (data) => <AvatarName player={data} addressUser />,
    },
    {
      title: translate('Achou que', 'Thought that', language),
      dataIndex: 'guess',
      key: 'guess',
    },
    {
      title: translate('Era', 'Was', language),
      dataIndex: 'clue',
      key: 'clue',
    },
    {
      title: translate('Resultado', 'Result', language),
      dataIndex: 'result',
      key: 'result',
      render: (value) =>
        value ? (
          <CheckSquareFilled style={{ color: 'green' }} />
        ) : (
          <CloseSquareFilled style={{ color: 'red' }} />
        ),
    },
  ];

  const parsedData = Object.values(players).map((player) => {
    return Object.entries(player?.guesses ?? {}).reduce((acc, [guessedPlayerId, guessedCoordinate]) => {
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
    }, []);
  });

  const dataSource = orderBy(parsedData.flat(), ['guess', 'playerName'], ['asc', 'asc']);

  return <Table size="small" columns={columns} dataSource={dataSource} pagination={false} sorter />;
}

function BadCluesPlayersList({ badCluesPlayersList }) {
  return (
    <span className="a">
      {badCluesPlayersList.map((player, index) => (
        <>
          <AvatarName player={player} key={`bad-clue-${player.id}`} size="small" />
          {badCluesPlayersList.length > 0 && index < badCluesPlayersList.length - 1 ? ', ' : ''}
        </>
      ))}
    </span>
  );
}

function StepReveal({ grid, user, players, clues, nextStep, whoGotNoPoints }) {
  const correctCoordinatesPerPlayer = clues.reduce((acc, clue) => {
    acc[clue.coordinate] = clue.playerId;
    return acc;
  }, {});

  const colorCodedCluesPerPlayer = clues.reduce((acc, clue) => {
    acc[clue.playerId] = AVATARS[players[clue.playerId].avatarId].color;
    return acc;
  }, {});

  const playerPerVotedCell = Object.values(players).reduce((acc, player) => {
    Object.entries(player.guesses ?? {}).forEach(([playerId, coordinate]) => {
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

  return (
    <div className="x-step">
      <Title>
        <Translate pt="Resultado" en="Resultado" />
      </Title>

      {Boolean(whoGotNoPoints.length) && (
        <Instruction contained>
          <WarningOutlined style={{ color: 'red' }} />
          <Translate
            pt={
              <>
                Ninguém acertou a(s) dica(s) dadas por
                <BadCluesPlayersList badCluesPlayersList={whoGotNoPointsNames} />, então ele(s) perde(m){' '}
                {Object.keys(players).length} pontos.
              </>
            }
            en={`Nobody got the clues given by ${(
              <BadCluesPlayersList badCluesPlayersList={whoGotNoPointsNames} />
            )}, so they lost ${Object.keys(players).length} points.`}
          />
        </Instruction>
      )}

      <WordGrid
        grid={grid}
        user={user}
        CellComponent={ResultCell}
        cellComponentProps={{ clues, players, playerPerVotedCell, colorCodedCluesPerPlayer }}
      />

      <ButtonContainer>
        <TimedButton
          duration={120}
          label={<Translate pt="Ver Ranking" en="See ranking" />}
          onExpire={nextStep}
          showTimer
          onClick={nextStep}
        />
      </ButtonContainer>

      <Title level={3}>
        <Translate pt="Todas as respostas" en="All Answers" />
      </Title>
      <AnswersList correctCoordinatesPerPlayer={correctCoordinatesPerPlayer} players={players} grid={grid} />
    </div>
  );
}

StepReveal.propTypes = {
  clues: PropTypes.shape({
    find: PropTypes.func,
    length: PropTypes.any,
  }),
  grid: PropTypes.any,
  onSubmitGuesses: PropTypes.func,
  user: PropTypes.any,
};

export default StepReveal;
