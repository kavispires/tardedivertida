// Ant Design Resources
import { Space } from 'antd';
// Types
import type { MovieGenreOption, SubmitMovieGenrePayload } from './utils/types';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { getRandomItem } from 'utils/helpers';
import { Icons } from './utils/helpers';
// Icons
import { MovieGenreIcon } from 'icons/MovieGenreIcon';
// Components
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { DualTranslate, Translate } from 'components/language';
import { TransparentButton } from 'components/buttons';
import { IconAvatar } from 'components/avatars';

type StepSelectGenreProps = {
  user: GamePlayer;
  genres: MovieGenreOption[];
  onSubmitGenre: (payload: SubmitMovieGenrePayload) => void;
} & AnnouncementProps;

export function StepSelectGenre({ user, announcement, genres, onSubmitGenre }: StepSelectGenreProps) {
  const { isLoading } = useLoading();

  useMock(() => {
    onSubmitGenre({ genre: getRandomItem(genres).key });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt={<>Selecione o gênero do filme</>} en={<>Select the movie genre</>} />
      </Title>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Somos diretores de elenco tentando determinar o elenco para um filme! Haverá 5 papéis para
              escalar, mas primeiro precisamos decidir qual é o gênero do filme em que vamos trabalhar!
              <br />
              Isso vai determinar quais serão os papéis que precisaremos escalar!
            </>
          }
          en={
            <>
              We are casting directors trying to determine the cast for a movie! There will be 5 roles to
              cast, but we first need to decide what genre is the movie we'll be working on!
              <br />
              This will determine what roles we'll need to cast!
            </>
          }
        />
      </RuleInstruction>

      <Space className="movie-genre-selection">
        {genres.map((genre) => {
          const Icon = Icons?.[genre.key] ?? MovieGenreIcon;
          return (
            <TransparentButton
              key={genre.key}
              onClick={() => onSubmitGenre({ genre: genre.key })}
              disabled={isLoading || user.ready}
              className="movie-genre-selection__button"
            >
              <IconAvatar icon={<Icon />} size={64} />
              <DualTranslate>{genre.title}</DualTranslate>
            </TransparentButton>
          );
        })}
      </Space>
    </Step>
  );
}
