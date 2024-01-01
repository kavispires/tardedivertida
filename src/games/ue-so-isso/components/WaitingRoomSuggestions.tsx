// Ant Design Resources
import { Space } from 'antd';
// Components
import { SuggestionEasel } from 'components/game/SuggestionEasel';

type WaitingRoomSuggestionsProps = {
  user: GamePlayer;
};

export function WaitingRoomSuggestions({ user }: WaitingRoomSuggestionsProps) {
  if (!user.suggestions) {
    return <></>;
  }

  return (
    <Space className="space-container">
      {user.suggestions.map((suggestion: string) => {
        return <SuggestionEasel value={suggestion} key={suggestion} id={suggestion} />;
      })}
    </Space>
  );
}
