import { sortBy } from 'lodash';
import { type ReactElement, useEffect, useState } from 'react';
import { useCopyToClipboard, useTitle } from 'react-use';
// Ant Design Resources
import { Layout, App, Switch, Divider } from 'antd';
// Icons
import * as icons from 'icons/collection';
import { collectionByCategory, collectionByGame, collectionUnassigned } from 'icons/collectionByGame';
// Components
import { TransparentButton } from 'components/buttons';
import { PageLayout } from 'components/layout/PageLayout';
// Internal
import { DevHeader } from './DevHeader';

type IconEntry = [string, (props: React.SVGProps<SVGSVGElement>) => ReactElement];

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
    <PageLayout className="dev-layout">
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
    </PageLayout>
  );
}

type AllIconsViewProps = {
  iconEntries: IconEntry[];
  copyToClipboard: (text: string) => void;
};

function AllIconsView({ iconEntries, copyToClipboard }: AllIconsViewProps) {
  return (
    <ul className="icons-grid">
      {iconEntries.map(([key, Icon]) => (
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
                const Icon = (
                  icons as Record<string, (props: React.SVGProps<SVGSVGElement>) => ReactElement>
                )[iconName];

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
