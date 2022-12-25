import { Button, Space } from 'antd';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { useLoading } from 'hooks/useLoading';
import { MinigameTitle } from './MinigameTitle';

import { Card } from 'components/cards';
import { useLanguage } from 'hooks/useLanguage';
import { IconAvatar } from 'components/icons/IconAvatar';
import { ThumbsUpIcon } from 'components/icons/ThumbsUpIcon';
import clsx from 'clsx';
import { useMock } from 'hooks/useMock';
import { mockSelection } from '../utils/mock';

export const TaskVamosNoCinema = ({ task, round, onSubmitTask, user }: TaskProps) => {
  const { isLoading } = useLoading();
  const { translate } = useLanguage();

  const onSelect = (value: string) => {
    onSubmitTask({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(['A', 'B', 'C', 'D']));
  });

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Decidimos que o filme que mais se encaixa nas críticas abaixo é o que vamos assistir! Qual filme
              você quer ver?
            </>
          }
          en={
            <>
              We decided that we will watch a movie that best match both reviews bellow! Which movie do you
              prefer?
            </>
          }
        />
      </Instruction>

      <Space className="space-container">
        <Card header={translate('Crítica Positiva', 'Good Review')} color="teal">
          <IconAvatar icon={<ThumbsUpIcon />} /> {task.data.reviews.good.text}
        </Card>

        <Card header={translate('Crítica Negativa', 'Bad Review')} color="red">
          <IconAvatar icon={<ThumbsUpIcon style={{ transform: 'rotate(180deg)' }} />} />{' '}
          {task.data.reviews.bad.text}
        </Card>
      </Space>

      <Space className="v-movies">
        <Space className="space-container" direction="vertical">
          <MovieCard movie={task.data.movies[0]} disableSuffix prefixColor="Khaki" />
          <MovieCard movie={task.data.movies[1]} prefixColor="aquamarine" suffixColor="Khaki" />
          <MovieCard movie={task.data.movies[2]} disablePrefix suffixColor="aquamarine" />
        </Space>
        <div className="v-movie-buttons">
          <Button
            shape="circle"
            size="large"
            type="primary"
            style={{ background: 'Khaki', color: 'black' }}
            onClick={() => onSelect('A')}
            disabled={isLoading || user.ready}
          >
            A
          </Button>
          <Button
            shape="circle"
            size="large"
            type="primary"
            style={{ background: 'aquamarine', color: 'black' }}
            onClick={() => onSelect('B')}
            disabled={isLoading || user.ready}
          >
            B
          </Button>
        </div>
        <div className="v-movie-buttons">
          <Button
            shape="circle"
            size="large"
            type="primary"
            style={{ background: 'LightGreen', color: 'black' }}
            onClick={() => onSelect('C')}
            disabled={isLoading || user.ready}
          >
            C
          </Button>
          <Button
            shape="circle"
            size="large"
            type="primary"
            style={{ background: 'Plum', color: 'black' }}
            onClick={() => onSelect('D')}
            disabled={isLoading || user.ready}
          >
            D
          </Button>
        </div>
        <Space className="space-container" direction="vertical">
          <MovieCard movie={task.data.movies[3]} disableSuffix prefixColor="LightGreen" />
          <MovieCard movie={task.data.movies[4]} prefixColor="Plum" suffixColor="LightGreen" />
          <MovieCard movie={task.data.movies[5]} disablePrefix suffixColor="Plum" />
        </Space>
      </Space>
    </>
  );
};

type MovieCardProps = {
  movie: MovieCard;
  disableSuffix?: boolean;
  suffixColor?: string;
  disablePrefix?: boolean;
  prefixColor?: string;
};
function MovieCard({ movie, disableSuffix, disablePrefix, prefixColor, suffixColor }: MovieCardProps) {
  return (
    <div className="v-movie">
      <div
        className={clsx('v-movie__suffix', disableSuffix && 'v-movie__suffix--disabled')}
        style={{ backgroundColor: suffixColor || 'rgba(248, 248, 248, 0.6)' }}
      >
        {movie.suffix}
      </div>

      <div
        className={clsx('v-movie__prefix', disablePrefix && 'v-movie__prefix--disabled')}
        style={{ backgroundColor: prefixColor || 'rgba(248, 248, 248, 0.6)' }}
      >
        {movie.prefix}
      </div>
    </div>
  );
}
