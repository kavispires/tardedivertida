import { type CSSProperties, useState } from 'react';
import { useTitle } from 'react-use';
// Ant Design Resources
import { Layout } from 'antd';
// Components
import { PageLayout } from 'components/general/PageLayout';
// Internal
import { DevHeader } from './DevHeader';
// import { Image, Layout } from 'antd';
// Resources

function Playground() {
  useTitle('Playground | Dev | Tarde Divertida');

  const styles: CSSProperties = {
    // display: 'grid',
    // gridTemplateColumns: 'repeat(5, 1fr)',

    // gap: '1rem',
    display: 'flex',
    flexWrap: 'wrap',
  };
  const stylesLi: CSSProperties = {
    border: '1px solid black',
    margin: '4px',
    padding: '8px',
    // width: '132px',
    // display: 'flex',
    // flexDirection: 'column',
    background: 'white',
    // alignItems: 'center',
    // justifyContent: 'space-between',
  };

  const [lines, setLines] = useState<any>([]);

  return (
    <PageLayout>
      <DevHeader title="Playground" />
      <Layout.Content className="dev-content">
        <div>playground content</div>
      </Layout.Content>
    </PageLayout>
  );
}

export default Playground;
