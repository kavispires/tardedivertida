// Icons
import { BoxBlankIcon } from '@icons/BoxBlankIcon';
import { BoxCheckMarkIcon } from '@icons/BoxCheckMarkIcon';
import { BoxQuestionMarkIcon } from '@icons/BoxQuestionMarkIcon';
import { BoxXIcon } from '@icons/BoxXIcon';
// Components
import { Icon } from '@components/general/Icon';
import { SpaceContainer } from '@components/layout/SpaceContainer';

const getActiveIcon = (value?: boolean, active?: boolean) => {
  if (value) return BoxCheckMarkIcon;
  if (value === false) return BoxXIcon;
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
    <SpaceContainer
      className="full-width"
      wrap
    >
      {steps.map((_, index) => {
        const ActiveIcon = getActiveIcon(results[index], activeStep === index);
        return (
          <Icon
            key={index}
            icon={<ActiveIcon />}
            {...getActiveClass(results[index], activeStep === index)}
          />
        );
      })}
    </SpaceContainer>
  );
}
