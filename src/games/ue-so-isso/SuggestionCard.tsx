import clsx from 'clsx';
// Design Resources
import { Avatar as AntAvatar } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
// Utils
import { getColorFromIndex } from '../../utils/helpers';
import { LETTERS } from '../../utils/constants';
// Components
import { Avatar, Card } from '../../components';

type SuggestionCardProps = {
  avatarId: string;
  index: number;
  playerName?: PlayerName;
  invalid?: boolean;
  suggestion: string;
};

function SuggestionCard({ avatarId, playerName, index, invalid, suggestion }: SuggestionCardProps) {
  return (
    <Card
      size="medium"
      color={getColorFromIndex(index)}
      className={clsx(invalid && 'u-suggestion-card__invalid')}
      header={playerName ? `${LETTERS[index]} (${playerName})` : LETTERS[index]}
    >
      {invalid ? (
        <AntAvatar size="small" className="u-suggestion-card__suggestion-avatar">
          <CloseOutlined />
        </AntAvatar>
      ) : (
        <Avatar id={avatarId} size="small" className="u-suggestion-card__suggestion-avatar" />
      )}
      {suggestion}
    </Card>
  );
}

export default SuggestionCard;
