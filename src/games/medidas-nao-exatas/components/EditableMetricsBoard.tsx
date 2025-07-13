import { useState } from 'react';
// Types
import type { TextCard } from 'types/tdr';
// Components
import { TransparentButton } from 'components/buttons';
// Internal
import { Pip } from './Pip';

type EditableMetricsBoardProps = {
  metricsDescriptors: Record<string, TextCard[]>;
  evaluations: Record<string, number>;
  onChange?: (metricId: string, evaluation: number) => void;
  disabled?: boolean;
};

export function EditableMetricsBoard({
  metricsDescriptors,
  evaluations,
  onChange,
  disabled,
}: EditableMetricsBoardProps) {
  return (
    <div className="metrics-board">
      {Object.keys(metricsDescriptors).map((metricId) => {
        const descriptors = metricsDescriptors[metricId];
        const evaluation = evaluations?.[metricId] ?? 3;

        return (
          <Metric
            key={metricId}
            descriptors={descriptors}
            initialEvaluation={evaluation}
            onChange={(newEvaluation) => onChange?.(metricId, newEvaluation)}
            disabled={disabled}
          />
        );
      })}
    </div>
  );
}

type MetricProps = {
  descriptors: TextCard[];
  initialEvaluation?: number;
  onChange?: (evaluation: number) => void;
  disabled?: boolean;
};

function Metric({ descriptors, initialEvaluation = 3, onChange, disabled }: MetricProps) {
  const [evaluation, setEvaluation] = useState<number>(initialEvaluation);

  const onClickingOnTheLeft = () => {
    const val = Math.min(evaluation + 1, 6);
    setEvaluation(val);
    onChange?.(val);
  };

  const onClickingOnTheRight = () => {
    const val = Math.max(evaluation - 1, 0);
    setEvaluation(val);
    onChange?.(val);
  };

  return (
    <div className="metrics-board__metric">
      <TransparentButton
        onClick={onClickingOnTheLeft}
        className="metrics-board__card metrics-board__card--left"
        disabled={disabled}
      >
        {descriptors[0].text}
      </TransparentButton>

      <div className="metrics-board__evaluation">
        <Pip position={0} value={evaluation} />
        <Pip position={1} value={evaluation} />
        <Pip position={2} value={evaluation} />
        <Pip position={3} value={evaluation} />
        <Pip position={4} value={evaluation} />
        <Pip position={5} value={evaluation} />
      </div>

      <TransparentButton
        onClick={onClickingOnTheRight}
        className="metrics-board__card metrics-board__card--right"
        disabled={disabled}
      >
        {descriptors[1].text}
      </TransparentButton>
    </div>
  );
}
