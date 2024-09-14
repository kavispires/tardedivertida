// Ant Design Resources
import { PlusOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
// Utils
import { NOOP } from 'utils/constants';
// Internal
import type { AdedanhxGalleryEntry } from '../utils/types';
import { CategoryCell, LetterCell } from './Grid';

type FinalGalleryEntryProps = {
  entry: AdedanhxGalleryEntry;
};

export function FinalGalleryEntry({ entry }: FinalGalleryEntryProps) {
  return (
    <div className="final-gallery-entry">
      <CategoryCell data={entry.topic} updateAnswer={NOOP} />
      <PlusOutlined />
      <LetterCell data={entry.letter} updateAnswer={NOOP} />
      {entry.topAnswer && (
        <span className="final-gallery-entry__answer">
          <Tooltip title={entry.topAnswer.answer}>{entry.topAnswer.answer}</Tooltip>
        </span>
      )}
    </div>
  );
}
