import React from 'react';
//
import { Collapse } from 'antd';
import { useLanguage } from '../../hooks';
import { translate } from '../shared';

export function CollapsibleRule({ children, title }) {
  const language = useLanguage();
  return (
    <Collapse>
      <Collapse.Panel header={translate('Regras', 'Rules', language, title)} key="1">
        {children}
      </Collapse.Panel>
    </Collapse>
  );
}
