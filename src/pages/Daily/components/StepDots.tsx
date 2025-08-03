// Ant Design Resources
import { Badge, Flex } from 'antd';

type StepDotsProps = {
  current: number;
  total: number;
  color?: string;
  displayNumbers?: boolean;
};

export function StepDots({ current, total, color = 'gold', displayNumbers = false }: StepDotsProps) {
  const dots = Array.from({ length: total }, (_, i) => {
    const isActive = i === current;
    return (
      <Badge
        status="default"
        color={isActive ? color : 'rgba(0, 0, 0, 0.25)'}
        // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since the array is static
        key={i}
        count={displayNumbers ? i + 1 : undefined}
      />
    );
  });
  return <Flex gap={4}>{dots}</Flex>;
}
