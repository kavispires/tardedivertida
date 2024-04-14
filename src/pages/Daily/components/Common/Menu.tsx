import { AppstoreFilled, HeartFilled, HeartOutlined, QuestionCircleFilled } from '@ant-design/icons';
import { Button, Popover, Space } from 'antd';
import { LanguageSwitch, Translate } from 'components/language';
import { useState } from 'react';

import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type MenuProps = {
  hearts: number;
  total: number;
  openRules: boolean;
  rules: ReactNode;
};

export function Menu({ hearts, total, openRules, rules }: MenuProps) {
  return (
    <div className="menu">
      <DailyHubLink />
      <Hearts remaining={hearts} total={total} />
      <RulesModal defaultOpen={openRules} rules={rules} />
    </div>
  );
}

type HeartsProps = {
  remaining: number;
  total: number;
};

function Hearts({ remaining, total }: HeartsProps) {
  const hearts = Array(total)
    .fill(false)
    .map((_, i) => i < remaining);

  return (
    <div className="menu-hearts">
      {hearts.map((heart, i) => (heart ? <HeartFilled key={i} /> : <HeartOutlined key={i} />))}
    </div>
  );
}

type RulesModalProps = {
  rules: ReactNode;
  defaultOpen: boolean;
};

function RulesModal({ rules, defaultOpen }: RulesModalProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Popover
      title={<Translate pt="Regras" en="Rules" />}
      trigger="click"
      open={open}
      onOpenChange={(o) => setOpen(o)}
      content={
        <Space direction="vertical" size="small">
          <LanguageSwitch />
          <ul className="list">{rules}</ul>
          <Space className="space-container">
            <Button size="small" onClick={() => setOpen(false)}>
              <Translate pt="Fechar" en="Close" />
            </Button>
          </Space>
        </Space>
      }
      className="menu-entry"
    >
      <QuestionCircleFilled />
    </Popover>
  );
}

function DailyHubLink() {
  return (
    <Link to="/diario/hub">
      <Button type="text" style={{ color: 'white' }} icon={<AppstoreFilled />} />
    </Link>
  );
}
