import clsx from 'clsx';
// Ant Design Resources
import { CloseOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
// Utils
import { LETTERS } from 'utils/constants';
import { getColorFromIndex } from 'utils/helpers';
// Components
import { PlayerAvatar } from 'components/avatars';
import { Card } from 'components/cards';

type SuggestionCardProps = {
  avatarId: string;
  index: number;
  playerName?: PlayerName;
  invalid?: boolean;
  suggestion: string;
};

export function SuggestionCard({ avatarId, playerName, index, invalid, suggestion }: SuggestionCardProps) {
  return (
    <Card
      size="medium"
      color={getColorFromIndex(index)}
      className={clsx(invalid && 'u-suggestion-card__invalid')}
      header={playerName ? `${LETTERS[index]} (${playerName})` : LETTERS[index]}
    >
      {invalid ? (
        <Avatar
          size="small"
          className="u-suggestion-card__suggestion-avatar"
        >
          <CloseOutlined />
        </Avatar>
      ) : (
        <PlayerAvatar
          avatarId={avatarId}
          size="small"
          className="u-suggestion-card__suggestion-avatar"
        />
      )}
      {suggestion}
    </Card>
  );
}
