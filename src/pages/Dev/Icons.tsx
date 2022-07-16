// Ant Design Resources
import { Layout } from 'antd';
// Components
import * as icons from 'components/icons/collection';
import { useTitle } from 'react-use';
import { DevHeader } from './DevHeader';

function IconsPage() {
  useTitle('Icons | Dev | Tarde Divertida');
  const styles: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  };

  const stylesLi: React.CSSProperties = {
    border: '1px solid black',
    margin: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem',
  };
  const iconEntries = Object.entries(icons);
  return (
    <Layout style={{ background: 'none' }}>
      <DevHeader title="Icons" subTitle={`(${iconEntries.length})`} />
      <Layout.Content style={{ padding: '1rem', width: '100%' }}>
        <ul style={styles}>
          {iconEntries.map(([key, Icon], index) => (
            <li key={key} style={stylesLi}>
              <Icon style={{ width: '90px' }} />
              <div style={{ width: '90px', overflow: 'hidden', textAlign: 'center' }}>{key}</div>
            </li>
          ))}
        </ul>
      </Layout.Content>
    </Layout>
  );
}

export default IconsPage;
