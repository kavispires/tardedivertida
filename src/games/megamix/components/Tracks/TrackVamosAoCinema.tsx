// AntDesign Resources
import { Button, Space } from 'antd';
// Hooks
import { useMock } from 'hooks/useMock';
import { useLoading } from 'hooks/useLoading';
// Utils
import { mockSelection } from '../../utils/mock';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from '../MinigameTitle';
import { MovieCard } from 'components/cards/MovieCard';
import { MovieReviewCard } from 'components/cards/MovieReviewCard';

export const TrackVamosAoCinema = ({ track, round, onSubmitAnswer, user }: TrackProps) => {
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(['A', 'B', 'C', 'D']));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Vamos ao Cinema!', en: 'Movie Night!' }} />
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
          text={track.data.reviews.good.text}
          highlights={track.data.reviews.good.highlights}
        />

        <MovieReviewCard
          type="negative"
          text={track.data.reviews.bad.text}
          highlights={track.data.reviews.bad.highlights}
        />
      </Space>

      <Space className="v-movies">
        <Space className="space-container" direction="vertical">
          <MovieCard movie={track.data.movies[0]} disableSuffix prefixColor="Khaki" />
          <MovieCard movie={track.data.movies[1]} prefixColor="aquamarine" suffixColor="Khaki" />
          <MovieCard movie={track.data.movies[2]} disablePrefix suffixColor="aquamarine" />
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
          <MovieCard movie={track.data.movies[3]} disableSuffix prefixColor="LightGreen" />
          <MovieCard movie={track.data.movies[4]} prefixColor="Plum" suffixColor="LightGreen" />
          <MovieCard movie={track.data.movies[5]} disablePrefix suffixColor="Plum" />
        </Space>
      </Space>
    </>
  );
};
