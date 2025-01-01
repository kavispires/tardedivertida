// Ant Design Resources
import { Progress } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Icons
import { FlagIcon } from 'icons/FlagIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TextHighlight, Title } from 'components/text';

export function PhaseGameOver({ state, players }: PhaseProps) {
  const posterWidth = useCardWidth(8, { gap: 16, minWidth: 80, maxWidth: 150, margin: 32 });
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<FlagIcon />}>
      <SpaceContainer direction="vertical">
        <Title size="xx-small">
          <Translate pt="Pontuação" en="Score" />
        </Title>

        <Progress type="circle" percent={Math.round((100 * state.groupScore) / 30)} />

        <div>
          <Title level={4} size="x-small">
            <Translate pt="Filmes" en="Movies" />
          </Title>
          <SpaceContainer wrap>
            {state.finalMovies.map((movie: PlainObject) => (
              <SpaceContainer vertical key={movie.id}>
                <ImageCard id={movie.posterId} cardWidth={posterWidth} preview={false} />
                <TextHighlight>{movie.title}</TextHighlight>
              </SpaceContainer>
            ))}
          </SpaceContainer>
        </div>
      </SpaceContainer>
    </GameOverWrapper>
  );
}
