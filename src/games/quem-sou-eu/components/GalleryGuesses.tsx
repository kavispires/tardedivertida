import { orderBy } from 'lodash';
// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayer, GamePlayers } from 'types/player';
// Components
import { ImageCard } from 'components/image-cards';
import { DualTranslate, Translate } from 'components/language';
import { StarPoints } from 'components/points';
import {
  SlideShowBubbleValue,
  SlideShowLabel,
  SlideShowNoWins,
  SlideShowPlayersList,
} from 'components/slide-show';
// Internal
import type { Characters } from '../utils/types';
// Icons

type GalleryGuessesProps = {
  players: GamePlayers;
  playersSay: Record<CardId, PlayerId[]>;
  playersPoints: NumberDictionary;
  characters: Characters;
  currentColor: string;
  currentPlayer: GamePlayer;
  round: GameRound;
  imageCardMode: boolean;
};

export function GalleryGuesses({
  players,
  playersSay,
  playersPoints,
  characters,
  currentColor,
  currentPlayer,
  round,
  imageCardMode,
}: GalleryGuessesProps) {
  const entries = orderBy(
    Object.entries(playersSay).map(([cardId, playersIds]) => {
      return {
        cardId,
        character: characters[cardId],
        playersIds,
        count: playersIds.length,
        isCorrect: currentPlayer.character.id === cardId,
      };
    }),
    ['isCorrect', 'count', 'card.text'],
    ['desc', 'desc', 'asc'],
  );
  const correctGuesses = playersSay[currentPlayer.character.id];

  return (
    <Space className="q-gallery__info-container" direction="vertical">
      <Space className="q-gallery__votes" direction="vertical">
        <SlideShowLabel>
          <Translate pt="Jogadores votaram" en="Players voted" />
        </SlideShowLabel>

        {entries.map((entry, index) => {
          return (
            <div key={`guess-${entry.cardId}-${index}`} className="q-gallery__guess">
              <SlideShowBubbleValue winner={entry.isCorrect} backgroundColor={currentColor}>
                {imageCardMode ? (
                  <ImageCard id={entry.character.id} cardWidth={35} className="inline" />
                ) : (
                  <DualTranslate>{entry.character.name}</DualTranslate>
                )}
              </SlideShowBubbleValue>
              <SlideShowPlayersList playersIds={entry.playersIds} players={players} />
            </div>
          );
        })}
      </Space>

      <Space className="q-gallery__votes" direction="vertical">
        <SlideShowLabel>
          <Translate pt="Pontos" en="Points" />
        </SlideShowLabel>

        {correctGuesses.length ? (
          <>
            <div className="q-gallery__players">
              <SlideShowPlayersList playersIds={correctGuesses} players={players}>
                <StarPoints quantity={round.current} keyPrefix={`guessers-points-${currentPlayer.id}`} />
              </SlideShowPlayersList>
            </div>
            <div className="q-gallery__player-points">
              <SlideShowPlayersList playersIds={[currentPlayer.id]} players={players}>
                <StarPoints
                  quantity={playersPoints?.[currentPlayer.id]}
                  keyPrefix={`artist-points-${currentPlayer.id}`}
                />
              </SlideShowPlayersList>
            </div>
          </>
        ) : (
          <SlideShowNoWins>
            <Translate
              pt="Esses ícones devem ter sido uma bosta, heim."
              en="It must have been a very crappy glyphs. What a shame..."
            />
          </SlideShowNoWins>
        )}
      </Space>
    </Space>
  );
}
