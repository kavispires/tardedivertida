// Ant Design Resources
import { Space } from 'antd';
// Components
import { IconAvatar } from 'components/avatars';
import { BoxBlankIcon } from 'icons/BoxBlankIcon';
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxMinusIcon } from 'icons/BoxMinusIcon';
import { BoxQuestionMarkIcon } from 'icons/BoxQuestionMarkIcon';

const getActiveIcon = (value?: boolean, active?: boolean) => {
  if (value) return BoxCheckMarkIcon;
  if (value === false) return BoxMinusIcon;
  if (active) return BoxQuestionMarkIcon;
  return BoxBlankIcon;
};

type ResultsProps = {
  results: boolean[];
  steps: PlainObject[];
  activeStep: number;
};
export function Results({ steps, results, activeStep }: ResultsProps) {
  return (
    <Space className="space-container full-width" wrap>
      {steps.map((_, index) => {
        const ActiveIcon = getActiveIcon(results[index], activeStep === index);
        return <IconAvatar icon={<ActiveIcon />} />;
      })}
    </Space>
  );
}
