// Ant Design Resources
import { Space } from 'antd';
// Icons
import { BoxBlankIcon } from 'icons/BoxBlankIcon';
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxMinusIcon } from 'icons/BoxMinusIcon';
import { BoxQuestionMarkIcon } from 'icons/BoxQuestionMarkIcon';
// Components
import { IconAvatar } from 'components/avatars';

const getActiveIcon = (value?: boolean, active?: boolean) => {
  if (value) return BoxCheckMarkIcon;
  if (value === false) return BoxMinusIcon;
  if (active) return BoxQuestionMarkIcon;
  return BoxBlankIcon;
};

const getActiveClass = (value?: boolean, active?: boolean) => {
  if (value) return { style: { background: 'green' } };
  if (value === false) return { style: { background: 'red' } };
  if (active) return { style: { background: 'yellow' } };
  return { style: { background: 'grey' } };
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
        return <IconAvatar icon={<ActiveIcon />} {...getActiveClass(results[index], activeStep === index)} />;
      })}
    </Space>
  );
}
