import { Avatar as AntAvatar, Button, Space, Spin } from 'antd';
import clsx from 'clsx';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { MovieCard } from 'components/cards/MovieCard';
import { IconAvatar } from 'components/icons/IconAvatar';
import { ScaredIcon } from 'components/icons/ScaredIcon';
import { StarIcon } from 'components/icons/StarIcon';
import { TomatoIcon } from 'components/icons/TomatoIcon';
import { Avatar } from 'components/avatars';

type MoviesProps = {
  movies: MovieCard[];
  user: GamePlayer;
  onSelect?: GenericFunction;
  eliminatedMovies?: CardId[];
  playerMovie?: CardId;
  mistakes?: CardId[];
  players?: GamePlayers;
  showResults?: boolean;
};

const fakeMoviesLeft = [
  {
    color: 'hsl(15deg 77% 85%)',
    letter: 'A',
  },
  {
    color: 'hsl(159deg 77% 85%)',
    letter: 'B',
  },
  {
    color: 'hsl(267deg 77% 85%)',
    letter: 'C',
  },
  {
    color: 'hsl(51deg 77% 85%)',
    letter: 'D',
  },
  {
    color: 'hsl(195deg 77% 85%)',
    letter: 'E',
  },
];

const fakeMoviesRight = [
  {
    color: 'hsl(303deg 77% 85%)',
    letter: 'F',
  },
  {
    color: 'hsl(87deg 77% 85%)',
    letter: 'G',
  },
  {
    color: 'hsl(231deg 77% 85%)',
    letter: 'H',
  },
  {
    color: 'hsl(339deg 77% 85%)',
    letter: 'I',
  },
  {
    color: 'hsl(123deg 77% 85%)',
    letter: 'J',
  },
];

export function Movies({
  movies,
  user,
  onSelect = () => {},
  eliminatedMovies = [],
  mistakes = [],
  players = {},
  showResults = false,
}: MoviesProps) {
  const { isLoading } = useLoading();

  const leftMovies = movies.slice(0, movies.length / 2);
  const rightMovies = movies.slice(movies.length / 2);

  const moviePlayerDict = Object.values(players).reduce((acc: Record<CardId, PlayerId[]>, player) => {
    if (!acc[player.movieId]) {
      acc[player.movieId] = [];
    }
    acc[player.movieId].push(player.id);
    return acc;
  }, {});

  return (
    <Space className="movies">
      <Space className="space-container" direction="vertical">
        {leftMovies.map((movie, index, arr) => (
          <div key={movie.id} className="movie-container">
            <PlayersSelections
              side="left"
              index={index}
              moviePlayerDict={moviePlayerDict}
              players={players}
              mistakes={mistakes}
              showAll={showResults}
            />
            <MovieCard
              movie={movie}
              disableSuffix={index === 0}
              prefixColor={fakeMoviesLeft?.[index]?.color}
              disablePrefix={index === arr.length - 1}
              suffixColor={fakeMoviesLeft?.[index - 1]?.color}
            />
          </div>
        ))}
      </Space>
      <div className="movie-buttons">
        {fakeMoviesLeft.map((entry) => {
          const isEliminated = eliminatedMovies.includes(entry.letter);
          const isPlayerMovie = user?.movieId === entry.letter;
          const isWrong = mistakes.includes(entry.letter);
          return (
            <Button
              key={entry.letter}
              shape="circle"
              size="large"
              type="primary"
              style={{ background: entry.color, color: 'black' }}
              onClick={() => onSelect(entry.letter)}
              disabled={isLoading || user.ready || isEliminated}
              className={clsx(entry.letter === user.movieId && 'movie-button--selected')}
            >
              <ButtonLabel
                isEliminated={isEliminated}
                isLoading={isLoading}
                isPlayerMovie={isPlayerMovie}
                isWrong={isWrong}
                letter={entry.letter}
              />
            </Button>
          );
        })}
      </div>
      <div className="movie-buttons">
        {fakeMoviesRight.map((entry) => {
          const isEliminated = eliminatedMovies.includes(entry.letter);
          const isPlayerMovie = user?.movieId === entry.letter;
          const isWrong = mistakes.includes(entry.letter);
          return (
            <Button
              key={entry.letter}
              shape="circle"
              size="large"
              type="primary"
              style={{ background: entry.color, color: 'black' }}
              onClick={() => onSelect(entry.letter)}
              disabled={isLoading || user.ready || isEliminated}
              className={clsx(entry.letter === user.movieId && 'movie-button--selected')}
            >
              <ButtonLabel
                isEliminated={isEliminated}
                isLoading={isLoading}
                isPlayerMovie={isPlayerMovie}
                isWrong={isWrong}
                letter={entry.letter}
              />
            </Button>
          );
        })}
      </div>
      <Space className="space-container" direction="vertical">
        {rightMovies.map((movie, index, arr) => (
          <div key={movie.id} className="movie-container">
            <PlayersSelections
              side="right"
              index={index}
              moviePlayerDict={moviePlayerDict}
              players={players}
              mistakes={mistakes}
              showAll={showResults}
            />
            <MovieCard
              movie={movie}
              disableSuffix={index === 0}
              prefixColor={fakeMoviesRight?.[index]?.color}
              disablePrefix={index === arr.length - 1}
              suffixColor={fakeMoviesRight?.[index - 1]?.color}
            />
          </div>
        ))}
      </Space>
    </Space>
  );
}

type MovieButtonLabel = {
  isEliminated: boolean;
  isLoading: boolean;
  letter: string;
  isPlayerMovie: boolean;
  isWrong: boolean;
};

function ButtonLabel({ isEliminated, isLoading, letter, isPlayerMovie, isWrong }: MovieButtonLabel) {
  if (isWrong) {
    return <IconAvatar icon={<ScaredIcon />} size="small" />;
  }

  if (isEliminated) {
    return <IconAvatar icon={<TomatoIcon />} size="small" />;
  }

  if (isPlayerMovie) {
    return <IconAvatar icon={<StarIcon />} size="small" />;
  }

  return isLoading ? <Spin /> : <>{letter}</>;
}

type PlayersSelectionsProps = {
  side: 'left' | 'right';
  index: number;
  moviePlayerDict: Record<CardId, PlayerId[]>;
  players: GamePlayers;
  mistakes: CardId[];
  showAll: boolean;
};

function PlayersSelections({
  side,
  index,
  moviePlayerDict,
  players,
  mistakes,
  showAll,
}: PlayersSelectionsProps) {
  if (index > 4) return <></>;

  const dict = side === 'left' ? ['A', 'B', 'C', 'D', 'E'] : ['F', 'G', 'H', 'I', 'J'];
  const movieId = dict[index];

  if (!showAll && !mistakes.includes(movieId)) return <></>;

  const moviePlayers = moviePlayerDict[movieId] ?? [];

  return (
    <span className={clsx('movie-players', side === 'right' && 'movie-players--right')}>
      <AntAvatar.Group maxCount={5}>
        {moviePlayers.map((playerId) => (
          <Avatar id={players[playerId].avatarId} key={playerId} />
        ))}
      </AntAvatar.Group>
    </span>
  );
}
