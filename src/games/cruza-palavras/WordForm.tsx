import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
//Design Resources
import { Button, Input, Space } from 'antd';
// Utils
import { isDevEnv } from '../../utils/helpers';
// Components
import { Translate } from '../../components';

type WordFormProps = {
  x: string;
  y: string;
  onSubmit: GenericFunction;
  disabled?: boolean;
};

function WordForm({ x, y, onSubmit, disabled }: WordFormProps) {
  const [clue, setClue] = useState('');

  const onChange = (e: any) => {
    setClue(e.target.value);
  };

  // TODO: DEV-ONLY - REMOVE
  useEffect(() => {
    if (isDevEnv) {
      onSubmit(`${x.substring(0, x.length / 2)}${y.substring(y.length / 2)}`);
    }
  }, []); // eslint-disable-line

  return (
    <Space direction="vertical">
      <Input placeholder={`${x} + ${y}`} onChange={onChange} onPressEnter={() => onSubmit(clue)} />
      <Button type="primary" onClick={() => onSubmit(clue)} disabled={disabled || !clue.length}>
        <Translate pt="Enviar" en="Submit" />
      </Button>
    </Space>
  );
}

WordForm.propTypes = {
  onSubmit: PropTypes.func,
  x: PropTypes.any,
  y: PropTypes.any,
};

export default WordForm;
