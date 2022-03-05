//Design Resources
import { Button, Popover } from 'antd';
import { FormOutlined } from '@ant-design/icons';
// Components
import { Translate } from 'components';
import PreviousClue from './PreviousClue';
import WordForm from './WordForm';

type WritingCellProps = {
  onSubmitClue: GenericFunction;
  cell: CruzaPalavrasGridCell;
  disabled?: boolean;
  user: GamePlayer;
};

function WritingCell({ onSubmitClue, cell, user, disabled }: WritingCellProps) {
  if (cell.writable && user.id === cell.playerId) {
    return (
      <Popover
        content={<WordForm x={cell.xText ?? ''} y={cell.yText ?? ''} onSubmit={onSubmitClue} />}
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

export default WritingCell;
