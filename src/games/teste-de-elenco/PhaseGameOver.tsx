// Ant Design Resources
import { Input, Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { CrownIcon } from 'icons/CrownIcon';
import { MovieGenreIcon } from 'icons/MovieGenreIcon';
// Components
import { SuspectCard } from 'components/cards/SuspectCard';
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Container } from 'components/general/Container';
import { HostOnlyContainer } from 'components/host';
import { ImageCard } from 'components/image-cards';
import { DualTranslate, Translate } from 'components/language';
import { TextHighlight, Title } from 'components/text';
// Internal
import type { FeatureFilm } from './utils/types';
import { achievementsReference } from './utils/achievements';
import { Icons, chatGPTMoviePrompt } from './utils/helpers';
import { RoleBoard } from './components/RoleBoard';
import { MovieStats } from './components/MovieStats';

export function PhaseGameOver({ state, players }: PhaseProps) {
  const { language } = useLanguage();

  const movie: FeatureFilm = state.movie;
  const movieId = movie?.id ?? '';
  const Icon = Icons?.[movieId] ?? MovieGenreIcon;

  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<CrownIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <Container
        title={<Translate pt="O Filme" en="The Movie" />}
        contentProps={{ className: 'final-gallery' }}
      >
        <Space className="role" direction="vertical" align="center">
          {movie && (
            <>
              <Icon width={75} />
              <Title size="small" className="role__title">
                {movie.movieTitle}
              </Title>
              <TextHighlight>
                <DualTranslate>{movie.genre}</DualTranslate>
              </TextHighlight>

              <MovieStats movie={movie} />

              {movie.rolesOrder.reverse().map((roleId) => {
                const role = movie.roles[roleId];

                if (role.cast && role.actor) {
                  const actor = role.candidates[role.actor];
                  return (
                    <RoleBoard activeRole={role} instruction="CAST" key={roleId}>
                      <SuspectCard suspect={actor} width={100} />
                    </RoleBoard>
                  );
                }
                return (
                  <RoleBoard activeRole={role} instruction="CAST" key={roleId}>
                    <ImageCard id="us-unknown" cardWidth={120} preview={false} />
                  </RoleBoard>
                );
              })}
            </>
          )}
        </Space>
      </Container>

      <HostOnlyContainer>
        <Container title="Chat GPT Prompt">
          <Input.TextArea
            readOnly
            value={chatGPTMoviePrompt(state.movie, language)}
            rows={5}
            cols={20}
            className="chat-gpt"
          />
        </Container>
      </HostOnlyContainer>
    </GameOverWrapper>
  );
}
