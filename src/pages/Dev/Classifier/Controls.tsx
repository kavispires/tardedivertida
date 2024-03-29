import { Button, Divider, Space } from 'antd';

import { FIRST_ID } from './constants';

import type { AlienItemDict } from './types';
import { downloadObjectAsFile } from './helpers';
import { ClassifierContextType } from './ClassifierContext';
import { TOTAL_ALIEN_ITEMS } from 'utils/constants';

type ControlsProps = {
  itemId: string;
  itemNumber: number;
  previousItem: () => void;
  nextItem: () => void;
  goTo: (target: number | 'first' | 'last') => void;
  isSaving: boolean;
  save: ClassifierContextType['save'];
  latestId: string;
  data: AlienItemDict;
  isDirty: boolean;
};

export function Controls({
  itemId,
  itemNumber,
  previousItem,
  nextItem,
  goTo,
  save,
  isSaving,
  data,
  latestId,
  isDirty,
}: ControlsProps) {
  return (
    <Space className="classifier__navigation" wrap>
      <Space wrap>
        <Button type="primary" onClick={() => save(data)} loading={isSaving} disabled={isSaving || !isDirty}>
          Save
        </Button>
      </Space>
      <Space wrap>
        <Button onClick={() => goTo('first')} disabled={itemId === FIRST_ID}>
          First
        </Button>
        <Button onClick={() => goTo(-10)} disabled={itemNumber <= 10}>
          Previous 10
        </Button>
        <Button onClick={previousItem} disabled={itemId === FIRST_ID}>
          Previous
        </Button>
        <Divider type="vertical" />
        <Button onClick={nextItem} disabled={itemId === TOTAL_ALIEN_ITEMS}>
          Next
        </Button>
        <Button onClick={() => goTo(10)} disabled={itemNumber >= Number(TOTAL_ALIEN_ITEMS) - 10}>
          Next 10
        </Button>
        <Button onClick={() => goTo('last')} disabled={itemNumber >= Number(latestId) - 1}>
          Latest
        </Button>
      </Space>
      <Space wrap>
        <Button
          onClick={() => downloadObjectAsFile(data, 'alien-items')}
          loading={isSaving}
          disabled={isSaving}
        >
          Download JSON
        </Button>
      </Space>
    </Space>
  );
}
