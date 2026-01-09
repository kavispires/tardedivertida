import clsx from 'clsx';
import { useEffect } from 'react';
import { useCopyToClipboard, useTitle } from 'react-use';
// Ant Design Resources
import { Layout, App } from 'antd';
// Icons
import * as icons from 'icons/collection';
// Components
import { TransparentButton } from 'components/buttons';
import { PageLayout } from 'components/layout/PageLayout';
// Internal
import { DevHeader } from './DevHeader';

const COLOR_NAMES = [
  'brown',
  'yellow',
  'orange',
  'green',
  'teal',
  'blue',
  'purple',
  'violet',
  'pink',
  'red',
  'white',
  'gray',
  'black',
  'lime',
];

const COLOR_SHADES = new Array(9).fill(1).map((e, i) => e + i);

function ColorsPage() {
  const { message } = App.useApp();
  useTitle('Colors | Dev | Tarde Divertida');
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
    <PageLayout className="dev-layout">
      <DevHeader
        title="Colors"
        subTitle={`(${iconEntries.length})`}
      />
      <Layout.Content className="dev-content">
        <ul style={styles}>
          {COLOR_NAMES.map((colorName) => (
            <li
              key={colorName}
              style={stylesLi}
            >
              <ul>
                {COLOR_SHADES.map((colorShade) => (
                  <li key={`${colorName}-${colorShade}`}>
                    <TransparentButton
                      onClick={() => copyToClipboard(`get-color(${colorName}, ${colorShade});`)}
                    >
                      <div
                        className={clsx('dev-color-swatch', `dev-color-swatch--${colorName}-${colorShade}`)}
                      >
                        get-color({colorName}, {colorShade})
                      </div>
                    </TransparentButton>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Layout.Content>
    </PageLayout>
  );
}

export default ColorsPage;
