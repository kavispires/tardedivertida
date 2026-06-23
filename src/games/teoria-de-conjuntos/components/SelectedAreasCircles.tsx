import { Fragment, type ReactElement } from 'react';
// Icons
import { CircleIcon } from '@icons/CircleIcon';
import { XIcon } from '@icons/XIcon';
// Components
import { Icon } from '@components/general/Icon';

type SelectedAreasCirclesProps = {
  selectedArea: string | null;
  size?: 'small' | 'large' | number;
};

export function SelectedAreasCircles({ selectedArea, size = 'small' }: SelectedAreasCirclesProps) {
  if (selectedArea === null) {
    return null;
  }

  const areas = selectedArea.split('');

  const icons: Record<string, ReactElement> = {
    A: (
      <Icon
        size={size}
        icon={<CircleIcon mainColor="blue" />}
      />
    ),
    W: (
      <Icon
        size={size}
        icon={<CircleIcon mainColor="yellow" />}
      />
    ),
    C: (
      <Icon
        size={size}
        icon={<CircleIcon mainColor="red" />}
      />
    ),
    O: (
      <Icon
        size={size}
        icon={<XIcon mainColor="#736357" />}
      />
    ),
  };

  return (
    <>
      {areas.map((areaId, index, arr) => (
        <Fragment key={areaId}>
          {icons[areaId]}
          {index < arr.length - 1 ? ' + ' : ''}
        </Fragment>
      ))}
    </>
  );
}
