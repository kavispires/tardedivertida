import { useEffect, useState } from 'react';
// Design Resources
import { Button, Popover } from 'antd';
import { ReadOutlined } from '@ant-design/icons';
// Components
import { Translate } from '../shared';

type PopoverRuleProps = {
  content: any;
  showLabel?: boolean;
};

export function PopoverRule({ content, showLabel = false }: PopoverRuleProps) {
  const [isActive, setActive] = useState(false);

  useEffect(() => {
    console.log('here');
    setActive(showLabel);
  }, []); // eslint-disable-line

  return (
    <div className="popover-rule">
      <Popover placement="bottomLeft" content={content} trigger="click">
        <Button
          shape={'round'}
          size="large"
          onMouseOver={() => setActive(true)}
          onMouseLeave={() => setActive(showLabel ?? false)}
        >
          <ReadOutlined />
          {isActive && <Translate pt=" Regras" en=" Rules" />}
        </Button>
      </Popover>
    </div>
  );
}
