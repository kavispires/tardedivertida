// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Icons
import { TheEndIcon } from 'icons/TheEndIcon';
// Components
import { AvatarName } from 'components/avatars';
import { CanvasSVG } from 'components/canvas';
import { GameOverWrapper } from 'components/game-over';

function PhaseGameOver({ state, info, players }: PhaseProps) {
  const slideCount = Math.min(state.album[0]?.slides.length ?? 5, 8);
  const cardWidth = useCardWidth(slideCount, 32, 100);

  return (
    <GameOverWrapper info={info} state={state} announcementIcon={<TheEndIcon />}>
      <ul className="l-album-strips">
        {state.album.map((albumEntry: LAlbumEntry) => (
          <li key={`album-strip-${albumEntry.id}`} className="l-album-strip-entry">
            <div className="l-album-strip-entry__author">
              <AvatarName player={players[albumEntry.id]} />
            </div>
            <ul
              className="l-album-strip"
              style={{ gridTemplateColumns: `repeat(${albumEntry.slides.length - 1}, 1fr)` }}
            >
              {albumEntry.slides.slice(1).map((slide) => {
                const key = `slide-${albumEntry.id}-${slide.author}-${slide.type}`;

                if (slide.type === 'title') {
                  return (
                    <li key={key} className="l-album-strip-square-text" style={{ width: `${cardWidth}px` }}>
                      {slide.content}
                    </li>
                  );
                }

                if (slide.type === 'drawing') {
                  return (
                    <li key={key} className="l-album-strip-square-drawing">
                      <CanvasSVG drawing={slide.content} width={cardWidth} />
                    </li>
                  );
                }
                return <></>;
              })}
            </ul>
          </li>
        ))}
      </ul>
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
