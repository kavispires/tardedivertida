import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Avatar as AntAvatar } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
// Utils
import { getColorFromIndex } from '../../utils';
import { LETTERS } from '../../utils/constants';
// Components
import BasicCard from '../../components/cards/Card';
import { Avatar } from '../../components/avatars';

function SuggestionCard({ avatarId, playerName, index, invalid, suggestion }) {
  return (
    <BasicCard
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
    </BasicCard>
  );
}

SuggestionCard.propTypes = {
  avatarId: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  invalid: PropTypes.bool,
  playerName: PropTypes.string,
  suggestion: PropTypes.string.isRequired,
};

export default memo(SuggestionCard);
