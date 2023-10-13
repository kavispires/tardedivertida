import { Segmented } from 'antd';
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useTitle } from 'react-use';

import { DevHeader } from '../DevHeader';

import { StatsCard } from './StatsCard';
import { Grouping } from './Grouping';
import { ClassifyingCard } from './ClassifyingCard';
import { ClassifierProvider, useClassifier } from './ClassifierContext';

import './ItemClassifier.scss';

function ItemClassifier() {
  const { isLoading, isError, data } = useClassifier();
  const [view, setView] = useState('default');

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
  ];

  return (
    <div>
      <DevHeader
        title="Classifier"
        extra={<Segmented options={segments} defaultValue={view} onChange={(v: any) => setView(v)} />}
      />

      {view === 'default' && <ClassifyingCard />}
      {view === 'grouping' && <Grouping />}
      {view === 'stats' && <StatsCard />}
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
