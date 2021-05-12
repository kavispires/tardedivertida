import React, { memo } from 'react';
// Design Resources
import { Avatar as AntAvatar } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
// Components
import BasicCard from '../../cards/Card';
import clsx from 'clsx';
import Avatar from '../../avatars/Avatar';
import { getColorFromIndex } from '../../../utils';
import { LETTERS } from '../../../utils/constants';

function SuggestionCard({ suggestion, invalid, avatarId, index }) {
  return (
    <BasicCard
      size="medium"
      color={getColorFromIndex(index)}
      className={clsx(invalid && 'u-suggestion-card__invalid')}
      header={LETTERS[index]}
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

export default memo(SuggestionCard);
