import { NOOP } from 'utils/constants';
import { CategoryCell, LetterCell } from './Grid';
import { PlusOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

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
