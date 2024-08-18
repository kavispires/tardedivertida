import { useCopyToClipboard, useTitle } from 'react-use';
// Ant Design Resources
import { Layout, App, Switch, Divider } from 'antd';
// Components
import * as icons from 'icons/collection';
import { DevHeader } from './DevHeader';
import { TransparentButton } from 'components/buttons';
import { useEffect, useState } from 'react';
import { collectionByCategory, collectionByGame, collectionUnassigned } from 'icons/collectionByGame';
import { sortBy } from 'lodash';
// const styles: React.CSSProperties = {
//   width: '100%',
//   display: 'flex',
//   flexWrap: 'wrap',
//   justifyContent: 'space-between',
// };

// const stylesLi: React.CSSProperties = {
//   border: '1px solid black',
//   margin: '0.5rem',
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   padding: '0.5rem',
// };

type IconEntry = [string, (props: React.SVGProps<SVGSVGElement>) => JSX.Element];

function IconsPage() {
  const { message } = App.useApp();

  useTitle('Icons | Dev | Tarde Divertida');
  const [displayAll, setDisplayAll] = useState(true);
  const [state, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (state.value) {
      message.info(`Copied to clipboard: ${state.value}`);
    }
  }, [state, message]);

  const iconEntries = Object.entries(icons);

  return (
    <Layout className="dev-layout">
      <DevHeader
        title="Icons"
        subTitle={`(${iconEntries.length})`}
        extra={
          <Switch
            checkedChildren="All"
            unCheckedChildren="By Category"
            checked={displayAll}
            onChange={setDisplayAll}
          />
        }
      />
      <Layout.Content className="dev-content">
        {displayAll ? (
          <AllIconsView iconEntries={iconEntries} copyToClipboard={copyToClipboard} />
        ) : (
          <IconsByCategoryView iconEntries={iconEntries} copyToClipboard={copyToClipboard} />
        )}
      </Layout.Content>
    </Layout>
  );
}

type AllIconsViewProps = {
  iconEntries: IconEntry[];
  copyToClipboard: (text: string) => void;
};

function AllIconsView({ iconEntries, copyToClipboard }: AllIconsViewProps) {
  return (
    <ul className="icons-grid">
      {iconEntries.map(([key, Icon], index) => (
        <li key={key} className="icons-grid__item">
          <TransparentButton onClick={() => copyToClipboard(`<${key} />`)}>
            <Icon style={{ width: '90px' }} />
            <div style={{ width: '90px', overflow: 'hidden', textAlign: 'center' }}>{key}</div>
          </TransparentButton>
        </li>
      ))}
    </ul>
  );
}

function IconsByCategoryView({ iconEntries, copyToClipboard }: AllIconsViewProps) {
  const sortedCollectionByGameKeys = sortBy(Object.keys(collectionByGame));

  return (
    <>
      <IconsCategoryListing
        list={Object.keys(collectionByCategory)}
        collection={collectionByCategory}
        copyToClipboard={copyToClipboard}
      />

      <Divider />

      <IconsCategoryListing
        list={sortedCollectionByGameKeys}
        collection={collectionByGame}
        copyToClipboard={copyToClipboard}
      />

      <Divider />

      <IconsCategoryListing
        list={['unassigned']}
        collection={collectionUnassigned}
        copyToClipboard={copyToClipboard}
      />
    </>
  );
}

type IconsCategoryListingProps = {
  list: string[];
  collection: Record<string, string[]>;
  copyToClipboard: (text: string) => void;
};

function IconsCategoryListing({ list, collection, copyToClipboard }: IconsCategoryListingProps) {
  return (
    <>
      {list.map((game) => {
        const iconsNames = sortBy(collection[game]);

        return (
          <div key={game} className="icons-grid">
            <h2>
              {game} ({iconsNames.length})
            </h2>
            <ul className="icons-category-grid">
              {iconsNames.map((iconName) => {
                const Icon = (icons as Record<string, (props: React.SVGProps<SVGSVGElement>) => JSX.Element>)[
                  iconName
                ];

                if (!Icon) {
                  console.error(`Icon not found: ${iconName}`);
                  return null;
                }
                return (
                  <li key={iconName} className="icons-grid__item">
                    <TransparentButton onClick={() => copyToClipboard(`<${iconName} />`)}>
                      <Icon style={{ width: '90px' }} />
                      <div style={{ width: '90px', overflow: 'hidden', textAlign: 'center' }}>{iconName}</div>
                    </TransparentButton>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
}

export default IconsPage;
