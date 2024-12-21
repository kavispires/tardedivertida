import { useMemo } from 'react';
// Types
import type { GamePlayer } from 'types/player';
// Icons
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { NoIcon } from 'icons/NoIcon';
import { YesIcon } from 'icons/YesIcon';
// Components
import { AvatarStrip, IconAvatar } from 'components/avatars';
import { GlyphCard } from 'components/cards/GlyphCard';
// Internal
import { parseSelectedGlyphs } from '../utils/helpers';

type PlayerGlyphsProps = {
  player: GamePlayer;
  glyphWidth: number;
  done?: boolean;
};

export function PlayerGlyphs({ player, glyphWidth, done }: PlayerGlyphsProps) {
  const [positive, negative] = useMemo(
    () => parseSelectedGlyphs(player.selectedGlyphs ?? {}),
    [player.selectedGlyphs],
  );

  return (
    <div className="q-player-glyphs">
      <AvatarStrip
        player={player}
        withName
        className="q-player-glyphs__strip"
        icon={done ? <BoxCheckMarkIcon /> : undefined}
      />
      {positive.map((id, index) => {
        return (
          <div
            className="q-player-glyphs__entry q-player-glyphs__entry--positive"
            key={`pos-${player.id}-${id}-${index}`}
          >
            <IconAvatar icon={<YesIcon />} size="small" />
            {id ? (
              <GlyphCard width={glyphWidth} id={id} />
            ) : (
              <div
                className="q-selections__no-glyph"
                style={{ width: `${glyphWidth}px`, height: `${glyphWidth}px` }}
              />
            )}
          </div>
        );
      })}
      {negative.map((id, index) => {
        return (
          <div
            className="q-player-glyphs__entry q-player-glyphs__entry--negative"
            key={`neg-${player.id}-${id}-${index}`}
          >
            <IconAvatar icon={<NoIcon />} size="small" />
            {id ? (
              <GlyphCard width={glyphWidth} id={id} />
            ) : (
              <div
                className="q-selections__no-glyph"
                style={{ width: `${glyphWidth}px`, height: `${glyphWidth}px` }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
