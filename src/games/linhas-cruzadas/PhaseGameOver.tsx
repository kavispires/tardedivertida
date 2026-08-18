// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
// Icons
import { TheEndIcon } from '@icons/TheEndIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { CanvasSVG } from '@components/canvas/CanvasSVG';
import { PlayerAvatarStrip } from '@components/player/PlayerAvatarStrip';
import { GameOverWrapper } from '@components/results/GameOverWrapper';
// Internal
import type { AlbumEntry, PhaseGameOverState } from './utils/types';
import achievementsReference from './utils/achievements';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const slideCount = Math.min(state.album[0]?.slides.length ?? 5, 8);
  const cardWidth = useCardWidth(slideCount, { minWidth: 100 });

  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<TheEndIcon />}
    >
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />

      <ul className="l-album-strips">
        {state.album.map((albumEntry: AlbumEntry) => (
          <li
            key={`album-strip-${albumEntry.id}`}
            className="l-album-strip-entry"
          >
            <PlayerAvatarStrip
              player={players[albumEntry.id]}
              withName
            />

            <ul
              className="l-album-strip"
              style={{ gridTemplateColumns: `repeat(${albumEntry.slides.length - 1}, 1fr)` }}
            >
              {albumEntry.slides.slice(1).map((slide) => {
                const key = `slide-${albumEntry.id}-${slide.author}-${slide.type}`;

                if (slide.type === 'title') {
                  return (
                    <li
                      key={key}
                      className="l-album-strip-square-text"
                      style={{ width: `${cardWidth}px` }}
                    >
                      {slide.content}
                    </li>
                  );
                }

                if (slide.type === 'drawing') {
                  return (
                    <li
                      key={key}
                      className="l-album-strip-square-drawing"
                    >
                      <CanvasSVG
                        drawing={slide.content}
                        width={cardWidth}
                      />
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </li>
        ))}
      </ul>
    </GameOverWrapper>
  );
}
