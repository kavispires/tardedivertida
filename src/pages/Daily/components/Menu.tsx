import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
// Ant Design Resources
import { AppstoreFilled, HeartFilled, HeartOutlined, QuestionCircleFilled } from '@ant-design/icons';
import { Button, Drawer, Space } from 'antd';
// Components
import { Translate } from 'components/language';
// Internal
import { useDailyGlobalStore } from '../hooks/useDailyGlobalStore';

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
      <Hearts
        remaining={hearts}
        total={total}
      />
      <RulesModal
        defaultOpen={openRules}
        rules={rules}
      />
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
  const [, setRulesOpen] = useDailyGlobalStore('rulesOpen');

  // biome-ignore lint/correctness/useExhaustiveDependencies: only open matters
  useEffect(() => {
    // Update the global store's rulesOpen state when the drawer is opened or closed
    setRulesOpen(open);
  }, [open]);

  return (
    <>
      <Button
        type="text"
        style={{ color: 'white' }}
        icon={<QuestionCircleFilled />}
        onClick={() => setOpen(true)}
      />
      <Drawer
        title={
          <Translate
            pt="Regras"
            en="Rules"
          />
        }
        placement="bottom"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Space
          orientation="vertical"
          size="small"
        >
          <ul className="list">{rules}</ul>
        </Space>
      </Drawer>
    </>
  );
}

function DailyHubLink() {
  return (
    <Link to="/diario/hub">
      <Button
        type="text"
        style={{ color: 'white' }}
        icon={<AppstoreFilled />}
      />
    </Link>
  );
}
