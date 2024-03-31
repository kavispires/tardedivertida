import { useMemo } from 'react';
// Types
import type { GamePlayers } from 'types/player';
import type { FinalCharacterEntry } from '../utils/types';
// Utils
import { parseSelectedGlyphs } from '../utils/helpers';
// Icons
import { NoIcon } from 'icons/NoIcon';
import { YesIcon } from 'icons/YesIcon';
// Components
import { AvatarStrip, IconAvatar } from 'components/avatars';
import { GlyphCard } from 'components/cards/GlyphCard';
import { Card } from './Card';

type FinalCharacterProps = {
  players: GamePlayers;
  character: FinalCharacterEntry;
  glyphWidth: number;
  imageCardsMode: boolean;
};

export function FinalCharacter({ players, character, glyphWidth, imageCardsMode }: FinalCharacterProps) {
  const [positive, negative] = useMemo(() => parseSelectedGlyphs(character.glyphs ?? {}), [character.glyphs]);

  return (
    <div className="q-player-glyphs q-final-character">
      <AvatarStrip player={players[character.playerId]} withName className="q-player-glyphs__strip" />
      <Card width={100} character={character} imageCardMode={imageCardsMode} />

      {positive.map((id, index) => {
        return (
          <div
            className="q-player-glyphs__entry q-player-glyphs__entry--positive"
            key={`pos-${character.id}-${id}-${index}`}
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
            key={`neg-${character.id}-${id}-${index}`}
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
