import { useState } from 'react';
// Design Resources
import { Button, Collapse, Popover } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { Instruction, Translate, translate } from '../shared';
import { ReadOutlined } from '@ant-design/icons';

type CollapsibleRuleProps = {
  children: any;
  title?: string;
};
export function CollapsibleRule({ children, title }: CollapsibleRuleProps) {
  const language = useLanguage();
  return (
    <Instruction contained>
      <Collapse ghost>
        <Collapse.Panel header={translate('Regras', 'Rules', language, title)} key="1">
          {children}
        </Collapse.Panel>
      </Collapse>
    </Instruction>
  );
}

type PopoverRuleProps = {
  content: any;
};

export function PopoverRule({ content }: PopoverRuleProps) {
  const [isActive, setActive] = useState(false);

  return (
    <div className="popover-rule">
      <Popover placement="bottomLeft" content={content} trigger="click">
        <Button
          shape={'round'}
          size="large"
          onMouseOver={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
        >
          <ReadOutlined />
          {isActive && <Translate pt=" Regras" en=" Rules" />}
        </Button>
      </Popover>
    </div>
  );
}
