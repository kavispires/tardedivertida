// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Internal
import type { Suggestion } from '../utils/types';
import { SuggestionCard } from './SuggestionCard';

type CardsProps = {
  suggestions: Suggestion[];
  readOnly: boolean;
  players: GamePlayers;
  onSetValidation: (index: number, suggestion: Suggestion) => void;
  isLoading: boolean;
  myRecommendation: Suggestion[];
};

export function Cards({
  suggestions,
  players,
  onSetValidation,
  isLoading,
  myRecommendation,
  readOnly = true,
}: CardsProps) {
  return (
    <Space className="u-word-compare-suggestions-step__suggestions">
      {suggestions.map((suggestionEntry, index) => {
        if (readOnly) {
          return (
            <div key={`${suggestionEntry.suggestion}-${index}`}>
              <SuggestionCard
                suggestion={suggestionEntry.suggestion}
                invalid={suggestionEntry.invalid}
                playerName={players[suggestionEntry.playerId].name}
                avatarId={players[suggestionEntry.playerId].avatarId}
                index={index}
              />
            </div>
          );
        }

        return (
          <button
            key={`${suggestionEntry.suggestion}-${index}`}
            type="button"
            className="u-word-compare-suggestions-step__suggestion-button"
            onClick={() => onSetValidation(index, suggestionEntry)}
            disabled={isLoading}
          >
            <SuggestionCard
              suggestion={suggestionEntry.suggestion}
              invalid={myRecommendation?.[index]?.invalid}
              avatarId={players[suggestionEntry.playerId].avatarId}
              playerName={players[suggestionEntry.playerId].name}
              index={index}
            />
          </button>
        );
      })}
    </Space>
  );
}
