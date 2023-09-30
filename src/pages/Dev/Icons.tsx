import { useCopyToClipboard, useTitle } from 'react-use';
// Ant Design Resources
import { Layout, App } from 'antd';
// Components
import * as icons from 'icons/collection';
import { DevHeader } from './DevHeader';
import { TransparentButton } from 'components/buttons';
import { useEffect } from 'react';

function IconsPage() {
  const { message } = App.useApp();

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

  const [state, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (state.value) {
      message.info(`Copied to clipboard: ${state.value}`);
    }
  }, [state, message]);

  const iconEntries = Object.entries(icons);
  return (
    <Layout className="dev-layout">
      <DevHeader title="Icons" subTitle={`(${iconEntries.length})`} />
      <Layout.Content className="dev-content">
        <ul style={styles}>
          {iconEntries.map(([key, Icon], index) => (
            <li key={key} style={stylesLi}>
              <TransparentButton onClick={() => copyToClipboard(`<${key} />`)}>
                <Icon style={{ width: '90px' }} />
                <div style={{ width: '90px', overflow: 'hidden', textAlign: 'center' }}>{key}</div>
              </TransparentButton>
            </li>
          ))}
        </ul>
      </Layout.Content>
    </Layout>
  );
}

export default IconsPage;
