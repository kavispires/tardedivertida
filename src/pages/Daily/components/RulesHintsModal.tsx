import { Region } from 'pages/Daily/components/Region';
import type { ReactNode } from 'react';
import { useToggle } from 'react-use';
// Ant Design Resources
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';
// Components
import { Translate } from 'components/language';

type RulesHintsProps = {
  label: ReactNode;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
};

export function RulesHintsModal({ label, title, description, children }: RulesHintsProps) {
  const [showTipsModal, toggleTipsModal] = useToggle(false);

  return (
    <>
      <Region className="rules-hints">
        <Button onClick={() => toggleTipsModal(true)} icon={<QuestionCircleOutlined />} ghost>
          {label}
        </Button>
      </Region>
      <Modal
        title={<Translate pt={title} en={title} />}
        open={showTipsModal}
        footer={null}
        onCancel={toggleTipsModal}
      >
        <Typography.Paragraph>{description}</Typography.Paragraph>

        {children}
      </Modal>
    </>
  );
}

type RuleEntryProps = {
  category: string;
  hints: string[];
};

export function RuleEntry({ category, hints }: RuleEntryProps) {
  return (
    <>
      <Typography.Paragraph>
        <Typography.Text strong>{category}: </Typography.Text>
        {hints.join(', ')}.
      </Typography.Paragraph>
      <ul></ul>
    </>
  );
}
