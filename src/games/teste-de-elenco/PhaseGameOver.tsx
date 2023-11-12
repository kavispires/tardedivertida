// Ant Design Resources
import { Input, Space } from 'antd';
// Utils
import { achievementsReference } from './utils/achievements';
import { Icons, chatGPTMoviePrompt } from './utils/helpers';
// Icons
import { CrownIcon } from 'icons/CrownIcon';
import { MovieGenreIcon } from 'icons/MovieGenreIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Container } from 'components/general/Container';
import { DualTranslate, Translate } from 'components/language';
import { Title } from 'components/text';
import { RoleBoard } from './components/RoleBoard';
import { SuspectCard } from 'components/cards/SuspectCard';
import { ImageCard } from 'components/image-cards';
import { VIPOnlyContainer } from 'components/vip';
import { useLanguage } from 'hooks/useLanguage';
import { useMemo } from 'react';
import { MovieStats } from './components/MovieStats';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  const { language } = useLanguage();

  const movie: FeatureFilm = state.movie;
  const movieId = movie?.id ?? '';
  const Icon = Icons?.[movieId] ?? MovieGenreIcon;

  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<CrownIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <Container
        title={<Translate pt="O Filme" en="The Movie" />}
        childrenContainerProps={{ className: 'final-gallery' }}
      >
        <Space className="role" direction="vertical" align="center">
          {movie && (
            <>
              <Icon width={75} />
              <Title size="small" className="role__title">
                <DualTranslate>{movie.title}</DualTranslate>
              </Title>

              <MovieStats movie={movie} />

              {movie.rolesOrder.reverse().map((roleId) => {
                const role = movie.roles[roleId];

                if (role.cast) {
                  return (
                    <RoleBoard activeRole={role} instruction="CAST" key={roleId}>
                      <SuspectCard suspect={role.candidates[role.actor]} width={100} />
                    </RoleBoard>
                  );
                }
                return (
                  <RoleBoard activeRole={role} instruction="CAST" key={roleId}>
                    <ImageCard imageId="us-unknown" cardWidth={120} preview={false} />
                  </RoleBoard>
                );
              })}
            </>
          )}
        </Space>
      </Container>

      <VIPOnlyContainer>
        <Container title="Chat GPT Prompt">
          <Input.TextArea
            readOnly
            value={chatGPTMoviePrompt(state.movie, language)}
            rows={5}
            cols={20}
            className="chat-gpt"
          />
        </Container>
      </VIPOnlyContainer>
    </GameOverWrapper>
  );
}
