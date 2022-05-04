// Ant Design Resources
import { Layout, PageHeader } from 'antd';
// Components
import { Icons } from 'components/icons';

function IconsPage() {
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
  const iconEntries = Object.entries(Icons);
  return (
    <Layout.Content style={{ padding: '1rem', width: '100%' }}>
      <PageHeader title={`Icons (${iconEntries.length})`} style={{ backgroundColor: 'white' }} />
      <ul style={styles}>
        {iconEntries.map(([key, Icon], index) => (
          <li key={key} style={stylesLi}>
            <Icon key={index} style={{ width: '90px' }} />
            <div style={{ width: '90px', overflow: 'hidden', textAlign: 'center' }}>{key}</div>
          </li>
        ))}
      </ul>
    </Layout.Content>
  );
}

export default IconsPage;
