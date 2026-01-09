import { Fragment, type ReactElement } from 'react';
// Icons
import { CircleIcon } from 'icons/CircleIcon';
import { XIcon } from 'icons/XIcon';
// Components
import { IconAvatar } from 'components/avatars';

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
      <IconAvatar
        size={size}
        icon={<CircleIcon mainColor="blue" />}
      />
    ),
    W: (
      <IconAvatar
        size={size}
        icon={<CircleIcon mainColor="yellow" />}
      />
    ),
    C: (
      <IconAvatar
        size={size}
        icon={<CircleIcon mainColor="red" />}
      />
    ),
    O: (
      <IconAvatar
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
