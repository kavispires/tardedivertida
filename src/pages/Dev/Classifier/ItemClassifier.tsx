import { Segmented } from 'antd';
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useTitle } from 'react-use';

import { DevHeader } from '../DevHeader';

import { StatsCard } from './StatsCard';
import { Grouping } from './Grouping';
import { ClassifyingCard } from './ClassifyingCard';
import { ClassifierProvider, useClassifier } from './ClassifierContext';

import './ItemClassifier.scss';
import { useQueryParams } from 'hooks/useQueryParams';
import { Scenarios } from './Scenarios';
import { Priority } from './Priority';

function ItemClassifier() {
  const { isLoading, isError, data } = useClassifier();
  const [view, setView] = useState('default');
  const qp = useQueryParams({ view: 'default' });

  useEffect(() => {
    setView(qp.queryParams.view ?? 'default');
  }, [qp.queryParams.view]);

  if (isEmpty(data) && isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <PageError message="Something is wrong" />;
  }

  const segments = [
    { label: 'Classifier', value: 'default', disabled: view === 'default' },
    { label: 'Grouping', value: 'grouping', disabled: view === 'grouping' },
    { label: 'Stats', value: 'stats', disabled: view === 'stats' },
    { label: 'Priority', value: 'priority', disabled: view === 'priority' },
    { label: 'Scenarios', value: 'scenarios', disabled: view === 'scenarios' },
  ];

  return (
    <div>
      <DevHeader
        title="Classifier"
        extra={<Segmented options={segments} defaultValue={view} onChange={(v: any) => qp.add('view', v)} />}
      />

      {view === 'default' && <ClassifyingCard />}
      {view === 'grouping' && <Grouping />}
      {view === 'stats' && <StatsCard />}
      {view === 'priority' && <Priority />}
      {view === 'scenarios' && <Scenarios />}
    </div>
  );
}

function ItemClassifierPage() {
  useTitle('Items Classifier | Dev | Tarde Divertida');

  return (
    <ClassifierProvider>
      <ItemClassifier />
    </ClassifierProvider>
  );
}

export default ItemClassifierPage;
