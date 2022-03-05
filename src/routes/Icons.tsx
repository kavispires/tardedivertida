// Design Resources
import { Layout } from 'antd';
// Components
import * as icons from 'components/icons';

function Icons() {
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
  return (
    <Layout.Content style={{ padding: '1rem', width: '100%' }}>
      <ul style={styles}>
        {Object.entries(icons).map(([key, Icon], index) => (
          <li key={key} style={stylesLi}>
            <Icon key={index} style={{ width: '90px' }} />
            <div style={{ width: '90px', overflow: 'hidden', textAlign: 'center' }}>{key}</div>
          </li>
        ))}
      </ul>
    </Layout.Content>
  );
}

export default Icons;
