import React from 'react';
// Design Resources
import { Collapse } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { Instruction, translate } from '../shared';

export function CollapsibleRule({ children, title }) {
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
