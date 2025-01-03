// Ant Design Resources
import { FormOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Components
import { Translate } from 'components/language';
// Internal
import type { GridCell, SubmitCluePayload } from '../utils/types';
import { PreviousClue } from './PreviousClue';
import { WordForm } from './WordForm';

type WritingCellProps = {
  onSubmitClue: (payload: SubmitCluePayload) => void;
  cell: GridCell;
  disabled?: boolean;
  user: GamePlayer;
};

export function WritingCell({ onSubmitClue, cell, user, disabled }: WritingCellProps) {
  if (cell.writable && user.id === cell.playerId) {
    return (
      <Popover
        content={
          <WordForm x={cell.xText ?? ''} y={cell.yText ?? ''} index={cell.index} onSubmit={onSubmitClue} />
        }
        title={<Translate pt="Escreva" en="Write" />}
        trigger="click"
      >
        <Button shape="circle" type="primary" disabled={disabled}>
          <FormOutlined />
        </Button>
      </Popover>
    );
  }

  if (cell.text) {
    return <PreviousClue clue={cell.text} />;
  }

  return <></>;
}
