import { useMemo } from 'react';
// Types
import type { GamePlayers } from 'types/player';
// Icons
import { NoIcon } from 'icons/NoIcon';
import { YesIcon } from 'icons/YesIcon';
// Components
import { PlayerAvatarStrip, IconAvatar } from 'components/avatars';
import { GlyphCard } from 'components/cards/GlyphCard';
// Internal
import type { FinalCharacterEntry } from '../utils/types';
import { parseSelectedGlyphs } from '../utils/helpers';
import { QSECard } from './QSECard';

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
      <PlayerAvatarStrip
        player={players[character.playerId]}
        withName
        className="q-player-glyphs__strip"
      />
      <QSECard
        width={100}
        character={character}
        imageCardMode={imageCardsMode}
      />

      {positive.map((id, index) => {
        return (
          <div
            className="q-player-glyphs__entry q-player-glyphs__entry--positive"
            key={`pos-${character.id}-${id}-${index}`}
          >
            <IconAvatar
              icon={<YesIcon />}
              size="small"
            />
            {id ? (
              <GlyphCard
                width={glyphWidth}
                glyphId={id}
              />
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
            <IconAvatar
              icon={<NoIcon />}
              size="small"
            />
            {id ? (
              <GlyphCard
                width={glyphWidth}
                glyphId={id}
              />
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
