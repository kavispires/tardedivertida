import { useTitle } from 'react-use';
// Ant Design Resources
import { Segmented } from 'antd';
import { DevHeader } from '../DevHeader';

// Components
import './dev-image-cards.scss';
import { useImageCardsRelationshipData } from './hooks';
import { useEffect, useState } from 'react';
import { LoadingPage } from 'components/loaders';
import { isEmpty } from 'lodash';
import { PageError } from 'components/errors';
import { useQueryParams } from 'hooks/useQueryParams';
import { Comparator } from './Comparator';
import { Grouping } from './Grouping';

function ImageCardsRelationshipsPage() {
  useTitle('Image Cards Relationships | Dev | Tarde Divertida');
  const [view, setView] = useState('default');
  const qp = useQueryParams({ view: 'grouping' });

  useEffect(() => {
    setView(qp.queryParams.view ?? 'grouping');
  }, [qp.queryParams.view]);

  const query = useImageCardsRelationshipData();

  if (isEmpty(query.data) && query.isLoading) {
    return <LoadingPage />;
  }

  if (query.isError) {
    return <PageError message="Something is wrong" />;
  }

  const segments = [
    { label: 'Compare', value: 'default', disabled: view === 'compare' },
    { label: 'Grouping', value: 'grouping', disabled: view === 'grouping' },
  ];

  return (
    <div>
      <DevHeader
        title="Image Cards Relationships"
        extra={<Segmented options={segments} defaultValue={view} onChange={(v: any) => qp.add('view', v)} />}
      />

      {view === 'default' && <Comparator query={query} />}
      {view === 'grouping' && <Grouping query={query} />}
    </div>
  );
}

export default ImageCardsRelationshipsPage;
