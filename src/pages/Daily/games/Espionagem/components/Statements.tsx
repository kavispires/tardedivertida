import { motion } from 'framer-motion';
// Ant Design Resources
import { Alert, Flex } from 'antd';
// Utils
import { getAnimation } from 'utils/animations';
// Internal
import type { DailyEspionagemEntry } from '../utils/types';

const MotionAlert = motion(Alert);

type StatementsProps = {
  statements: DailyEspionagemEntry['statements'];
  statementsCutoffLength: number;
  released: string[];
  isComplete?: boolean;
  animate?: boolean;
};

export function Statements({
  statements,
  statementsCutoffLength,
  released,
  isComplete,
  animate,
}: StatementsProps) {
  const slicedStatements = isComplete ? statements : statements.slice(0, statementsCutoffLength);
  return (
    <Flex vertical gap={4} className="espionagem-statements">
      {slicedStatements.map((statement, index) => (
        <motion.div {...(animate ? getAnimation('fadeIn', { delay: 0.1 * index }) : {})} key={statement.key}>
          <MotionAlert
            banner
            message={statement.text}
            type={isStatementComplete(statement.excludes, released) ? 'success' : 'info'}
          />
        </motion.div>
      ))}
    </Flex>
  );
}

const isStatementComplete = (excludes: string[], released: string[]) => {
  return excludes.every((id) => released.includes(id));
};
