// AntDesign Resources
import { Button, Space } from 'antd';
// Hooks
import { useMock } from 'hooks/useMock';
import { useLoading } from 'hooks/useLoading';
// Utils
import { mockSelection } from '../utils/mock';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from './MinigameTitle';
import { MovieCard } from 'components/cards/MovieCard';
import { MovieReviewCard } from 'components/cards/MovieReviewCard';

export const TaskVamosAoCinema = ({ task, round, onSubmitTask, user }: TaskProps) => {
  const { isLoading } = useLoading();

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
        <MovieReviewCard
          type="positive"
          text={task.data.reviews.good.text}
          highlights={task.data.reviews.good.highlights}
        />

        <MovieReviewCard
          type="negative"
          text={task.data.reviews.bad.text}
          highlights={task.data.reviews.bad.highlights}
        />
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
