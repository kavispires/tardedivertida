import { useState } from 'react';
import { useEffectOnce } from 'react-use';
// Ant Design Resources
import { Button, Popover } from 'antd';
import { ReadOutlined } from '@ant-design/icons';
// Components
import { Translate } from 'components/language';

type PopoverRuleProps = {
  content: any;
  showLabel?: boolean;
  label?: any;
};

export function PopoverRule({ content, label, showLabel = true }: PopoverRuleProps): JSX.Element {
  const [isActive, setActive] = useState(false);

  useEffectOnce(() => {
    setActive(showLabel);
  });

  return (
    <div className="popover-rule">
      <Popover placement="bottomLeft" content={content} trigger="click">
        <Button
          shape="round"
          size="large"
          onMouseOver={() => setActive(true)}
          onMouseLeave={() => setActive(showLabel ?? false)}
        >
          <ReadOutlined />
          {isActive && Boolean(label) ? label : <Translate pt=" Regras" en=" Rules" />}
        </Button>
      </Popover>
    </div>
  );
}
