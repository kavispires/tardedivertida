import { sampleSize } from 'lodash';
import { useState } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import { Item } from 'types/tdr';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { getRandomItem } from 'utils/helpers';
// Icons
import { MovieGenreIcon } from 'icons/MovieGenreIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
import { Container } from 'components/general/Container';
import { DualTranslate, Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import type { MovieGenreOption, SubmitMovieGenrePayload } from './utils/types';
import { Icons } from './utils/helpers';
import { MovieGenreRules } from './components/RulesBlobs';

type StepSelectGenreProps = {
  user: GamePlayer;
  genres: MovieGenreOption[];
  onSubmitGenre: (payload: SubmitMovieGenrePayload) => void;
  moviesTitles: string[];
  movieProps: Item[];
} & Pick<StepProps, 'announcement'>;

export function StepSelectGenre({
  user,
  announcement,
  genres,
  onSubmitGenre,
  moviesTitles,
  movieProps,
}: StepSelectGenreProps) {
  const { isLoading } = useLoading();
  const [selectedMovieTitle, setSelectedMovieTitle] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedProps, setSelectedProps] = useState<string[]>([]);

  useMock(() => {
    onSubmitGenre({
      genre: getRandomItem(genres).key,
      movieTitle: getRandomItem(moviesTitles),
      propsIds: sampleSize(movieProps, 1).map((prop) => prop.id),
    });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate en={<>Let's customize the movie!</>} pt={<>Vamos personalizar o filme!</>} />
      </Title>

      <RuleInstruction type="rule">
        <MovieGenreRules />
      </RuleInstruction>

      <Container
        title={<Translate en="Select the genre of te movie" pt="Selecione o gênero do filme" />}
        contentProps={{
          style: { gridTemplateColumns: `repeat(${genres.length}, 1fr)` },
          className: 'movie-personalization-selection',
        }}
      >
        {genres.map((genre) => {
          const Icon = Icons?.[genre.key] ?? MovieGenreIcon;
          return (
            <TransparentButton
              key={genre.key}
              onClick={() => setSelectedGenre(genre.key)}
              disabled={isLoading || user.ready}
              className="movie-personalization-selection__button"
              active={selectedGenre === genre.key}
              activeClass="movie-personalization-selection__button--selected"
            >
              <IconAvatar icon={<Icon />} size={64} />
              <DualTranslate>{genre.title}</DualTranslate>
            </TransparentButton>
          );
        })}
      </Container>

      <Container
        title={<Translate en="Select the title of te movie" pt="Selecione o título do filme" />}
        contentProps={{
          style: { gridTemplateColumns: `repeat(${moviesTitles.length}, 1fr)` },
          className: 'movie-personalization-selection',
        }}
      >
        {moviesTitles.map((title) => {
          return (
            <TransparentButton
              key={title}
              onClick={() => setSelectedMovieTitle(title)}
              disabled={isLoading || user.ready}
              className="movie-personalization-selection__button"
              active={selectedMovieTitle === title}
              activeClass="movie-personalization-selection__button--selected"
            >
              <span>{title}</span>
            </TransparentButton>
          );
        })}
      </Container>

      <Container
        title={
          <Translate
            en="Select a thing important for the plot"
            pt="Selecione um elemento importante para o enredo"
          />
        }
        contentProps={{
          style: { gridTemplateColumns: `repeat(${movieProps.length}, 1fr)` },
          className: 'movie-personalization-selection movie-personalization-selection__items',
        }}
      >
        {movieProps.map((item) => {
          return (
            <TransparentButton
              key={item.id}
              onClick={() => setSelectedProps([item.id])}
              disabled={isLoading || user.ready}
              className="movie-personalization-selection__button"
              active={selectedProps[0] === item.id}
              activeClass="movie-personalization-selection__button--selected"
            >
              <ItemCard
                id={item.id}
                text={item.name}
                className="movie-personalization-selection__item-card"
              />
            </TransparentButton>
          );
        })}
      </Container>

      <Space className="space-container">
        <Button
          size="large"
          type="primary"
          onClick={() =>
            onSubmitGenre({ genre: selectedGenre, movieTitle: selectedMovieTitle, propsIds: selectedProps })
          }
          loading={isLoading}
          disabled={user.ready || !selectedGenre || !selectedMovieTitle || !selectedProps.length}
        >
          <Translate en="Submit" pt="Enviar" />
        </Button>
      </Space>
    </Step>
  );
}
