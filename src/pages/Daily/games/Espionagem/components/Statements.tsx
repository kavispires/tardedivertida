import { motion } from 'motion/react';
import { useMemo } from 'react';
// Ant Design Resources
import { AppstoreOutlined, AudioFilled, HeartFilled, SkinFilled } from '@ant-design/icons';
import { Alert, Flex } from 'antd';
// Utils
import { getAnimation } from 'utils/animations';
// Internal
import type { DailyEspionagemEntry } from '../utils/types';

const MotionAlert = motion.create(Alert);

type StatementsProps = {
  statements: DailyEspionagemEntry['statements'];
  additionalStatements: DailyEspionagemEntry['additionalStatements'];
  hearts: number;
  released: string[];
  isComplete?: boolean;
  animate?: boolean;
};

export function Statements({
  statements,
  additionalStatements,
  hearts,
  released,
  isComplete,
  animate,
}: StatementsProps) {
  const { slicedStatements, slicedAdditionalStatements } = useMemo(() => {
    return {
      slicedStatements: [
        ...(isComplete ? statements : statements.slice(0, Math.floor(released.length / 2) + 1)),
      ].reverse(),
      slicedAdditionalStatements: [
        ...(isComplete ? additionalStatements : additionalStatements.slice(0, 2 - hearts)),
      ].reverse(),
    };
  }, [statements, additionalStatements, hearts, released, isComplete]);
  return (
    <Flex
      vertical
      gap={4}
      className="espionagem-statements"
    >
      {slicedStatements.map((statement, index) => (
        <motion.div
          {...(animate ? getAnimation('fadeIn', { delay: 0.1 * index }) : {})}
          key={statement.key}
        >
          <MotionAlert
            banner
            icon={getStatementIcon(statement.type)}
            title={statement.text}
            type={isStatementComplete(statement.excludes, released) ? 'success' : 'info'}
          />
        </motion.div>
      ))}
      {slicedAdditionalStatements.map((statement, index) => (
        <motion.div
          {...(animate ? getAnimation('fadeIn', { delay: 0.1 * index }) : {})}
          key={statement.key}
        >
          <MotionAlert
            icon={<HeartFilled />}
            banner
            title={statement.text}
            type={isStatementComplete(statement.excludes, released) ? 'success' : 'warning'}
          />
        </motion.div>
      ))}
    </Flex>
  );
}

const isStatementComplete = (excludes: string[], released: string[]) => {
  return excludes.every((id) => released.includes(id));
};

const getStatementIcon = (type: DailyEspionagemEntry['statements'][number]['type']) => {
  switch (type) {
    case 'testimony':
      return <AudioFilled />;
    case 'feature':
      return <SkinFilled />;
    case 'grid':
      return <AppstoreOutlined />;
    default:
      return null;
  }
};
