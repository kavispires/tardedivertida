import PropTypes from 'prop-types';
//Design Resources
import { Button, Popover } from 'antd';
import { FormOutlined } from '@ant-design/icons';
// Components
import { Translate } from '../../components/shared';
import PreviousClue from './PreviousClue';
import WordForm from './WordForm';

function WritingCell({ onSubmitClue, cell, user, disabled }) {
  if (cell.writable && user.id === cell.playerId) {
    return (
      <Popover
        content={<WordForm x={cell.xText} y={cell.yText} onSubmit={onSubmitClue} />}
        title={<Translate pt="Escreva" en="Write" />}
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

WritingCell.propTypes = {
  cell: PropTypes.shape({
    playerId: PropTypes.any,
    text: PropTypes.any,
    writable: PropTypes.any,
    xText: PropTypes.any,
    yText: PropTypes.any,
  }),
  onSubmitClue: PropTypes.any,
  user: PropTypes.shape({
    id: PropTypes.any,
  }),
};

export default WritingCell;
