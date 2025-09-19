import { motion } from 'motion/react';
// Types
import type { TextCard } from 'types/tdr';
// Internal
import { Pip } from './Pip';

type MetricsBoardProps = {
  metricsDescriptors: Record<string, TextCard[]>;
  evaluations: Record<string, number>;
  level: number;
};

export function MetricsBoard({ metricsDescriptors, evaluations, level }: MetricsBoardProps) {
  return (
    <div className="metrics-board">
      {Object.keys(metricsDescriptors).map((metricId, index) => {
        const descriptors = metricsDescriptors[metricId];
        const evaluation = evaluations?.[metricId] ?? 3;

        return (
          <Metric key={metricId} descriptors={descriptors} evaluation={evaluation} visible={level > index} />
        );
      })}
    </div>
  );
}

type MetricProps = {
  descriptors: TextCard[];
  evaluation: number;
  visible: boolean;
};

function Metric({ descriptors, evaluation, visible }: MetricProps) {
  const animationProps = {
    initial: { opacity: 0 },
    transition: { delay: 1, duration: 2 },
    animate: { opacity: visible ? 1 : 0 },
  };

  return (
    <div className="metrics-board__metric">
      <motion.div {...animationProps} className="metrics-board__card metrics-board__card--left">
        {descriptors[0].text}
      </motion.div>

      <motion.div className="metrics-board__evaluation" {...animationProps}>
        <Pip position={0} value={evaluation} />
        <Pip position={1} value={evaluation} />
        <Pip position={2} value={evaluation} />
        <Pip position={3} value={evaluation} />
        <Pip position={4} value={evaluation} />
        <Pip position={5} value={evaluation} />
      </motion.div>

      <motion.div {...animationProps} className="metrics-board__card metrics-board__card--right">
        {descriptors[1].text}
      </motion.div>
    </div>
  );
}
