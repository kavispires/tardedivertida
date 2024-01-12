//Design Resources
import { Button, Popover } from 'antd';
import { FormOutlined } from '@ant-design/icons';
// Types
import type { GamePlayer } from 'types/player';
import type { GridCell } from '../utils/types';
// Components
import { Translate } from 'components/language';
import { PreviousClue } from './PreviousClue';
import { WordForm } from './WordForm';

type WritingCellProps = {
  onSubmitClue: GenericFunction;
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
