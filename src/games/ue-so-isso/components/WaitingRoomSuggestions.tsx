// Types
import type { GamePlayer } from 'types/player';
// Components
import { SuggestionEasel } from 'components/game/SuggestionEasel';
import { SpaceContainer } from 'components/layout/SpaceContainer';

type WaitingRoomSuggestionsProps = {
  user: GamePlayer;
};

export function WaitingRoomSuggestions({ user }: WaitingRoomSuggestionsProps) {
  if (!user.suggestions) {
    return null;
  }

  return (
    <SpaceContainer>
      {user.suggestions.map((suggestion: string) => {
        return <SuggestionEasel value={suggestion} key={suggestion} id={suggestion} />;
      })}
    </SpaceContainer>
  );
}
