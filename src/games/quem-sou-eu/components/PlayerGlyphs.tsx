import { useMemo } from 'react';
// Utils
import { parseSelectedGlyphs } from '../utils/helpers';
// Components
import { AvatarStrip } from 'components/avatars';
import { GlyphCard } from 'components/cards/GlyphCard';
import { IconAvatar } from 'components/icons/IconAvatar';
import { NoIcon } from 'components/icons/NoIcon';
import { YesIcon } from 'components/icons/YesIcon';
import { BoxCheckMarkIcon } from 'components/icons/BoxCheckMarkIcon';

type PopoverGlyphProps = {
  player: GamePlayer;
  glyphWidth: number;
  done?: boolean;
};

export function PlayerGlyphs({ player, glyphWidth, done }: PopoverGlyphProps) {
  const [positive, negative] = useMemo(
    () => parseSelectedGlyphs(player.selectedGlyphs ?? {}),
    [player.selectedGlyphs]
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
            {Boolean(id) ? (
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
            {Boolean(id) ? (
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
