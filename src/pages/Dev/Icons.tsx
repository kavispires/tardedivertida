import { sortBy } from 'lodash';
import { type ReactElement, useEffect, useState } from 'react';
import { useCopyToClipboard, useTitle } from 'react-use';
// Ant Design Resources
import { Layout, App, Switch, Divider, Input, Space } from 'antd';
// Icons
import * as icons from 'icons/collection';
import { collectionByCategory, collectionByGame, collectionUnassigned } from 'icons/collectionByGame';
// Components
import { TransparentButton } from 'components/buttons/TransparentButton';
import { PageLayout } from 'components/layout/PageLayout';
// Internal
import { DevHeader } from './DevHeader';

type IconEntry = [string, (props: React.SVGProps<SVGSVGElement>) => ReactElement];

function IconsPage() {
  const { message } = App.useApp();

  useTitle('Icons | Dev | Tarde Divertida');
  const [displayAll, setDisplayAll] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [copyWithBrackets, setCopyWithBrackets] = useState(true);
  const [state, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (state.value) {
      message.info(`Copied to clipboard: ${state.value}`);
    }
  }, [state, message]);

  const iconEntries = Object.entries(icons);

  const handleCopy = (iconName: string) => {
    const text = copyWithBrackets ? `<${iconName} />` : iconName;
    copyToClipboard(text);
  };

  return (
    <PageLayout className="dev-layout">
      <DevHeader
        title="Icons"
        subTitle={`(${iconEntries.length})`}
      />
      <div className="dev-icons-submenu">
        <Space
          size="large"
          wrap
        >
          <Space>
            <span>View:</span>
            <Switch
              checkedChildren="All"
              unCheckedChildren="By Category"
              checked={displayAll}
              onChange={setDisplayAll}
            />
          </Space>
          <Space>
            <span>Copy format:</span>
            <Switch
              checkedChildren="<Icon />"
              unCheckedChildren="Icon"
              checked={copyWithBrackets}
              onChange={setCopyWithBrackets}
            />
          </Space>
          <Input.Search
            className="dev-icons-search"
            placeholder="Search icons..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Space>
      </div>
      <Layout.Content className="dev-content">
        {displayAll ? (
          <AllIconsView
            iconEntries={iconEntries}
            copyToClipboard={handleCopy}
            searchText={searchText}
          />
        ) : (
          <IconsByCategoryView
            iconEntries={iconEntries}
            copyToClipboard={handleCopy}
            searchText={searchText}
          />
        )}
      </Layout.Content>
    </PageLayout>
  );
}

type AllIconsViewProps = {
  iconEntries: IconEntry[];
  copyToClipboard: (iconName: string) => void;
  searchText: string;
};

function AllIconsView({ iconEntries, copyToClipboard, searchText }: AllIconsViewProps) {
  const filteredEntries = searchText
    ? iconEntries.filter(([key]) => key.toLowerCase().includes(searchText.toLowerCase()))
    : iconEntries;

  return (
    <ul className="icons-grid">
      {filteredEntries.map(([key, Icon]) => (
        <li
          key={key}
          className="icons-grid__item"
        >
          <TransparentButton onClick={() => copyToClipboard(key)}>
            <Icon className="dev-icon" />
            <div className="dev-icon-label">{key}</div>
          </TransparentButton>
        </li>
      ))}
    </ul>
  );
}

function IconsByCategoryView({ copyToClipboard, searchText }: AllIconsViewProps) {
  const sortedCollectionByGameKeys = sortBy(Object.keys(collectionByGame));

  return (
    <>
      <IconsCategoryListing
        list={Object.keys(collectionByCategory)}
        collection={collectionByCategory}
        copyToClipboard={copyToClipboard}
        searchText={searchText}
      />

      <Divider />

      <IconsCategoryListing
        list={sortedCollectionByGameKeys}
        collection={collectionByGame}
        copyToClipboard={copyToClipboard}
        searchText={searchText}
      />

      <Divider />

      <IconsCategoryListing
        list={['unassigned']}
        collection={collectionUnassigned}
        copyToClipboard={copyToClipboard}
        searchText={searchText}
      />
    </>
  );
}

type IconsCategoryListingProps = {
  list: string[];
  collection: Record<string, string[]>;
  copyToClipboard: (iconName: string) => void;
  searchText: string;
};

function IconsCategoryListing({ list, collection, copyToClipboard, searchText }: IconsCategoryListingProps) {
  const { message } = App.useApp();
  return (
    <>
      {list.map((game) => {
        const iconsNames = sortBy(collection[game]);
        const filteredIcons = searchText
          ? iconsNames.filter((iconName) => iconName.toLowerCase().includes(searchText.toLowerCase()))
          : iconsNames;

        if (filteredIcons.length === 0) return null;

        return (
          <div
            key={game}
            className="icons-grid"
          >
            <h2>
              {game} ({filteredIcons.length})
            </h2>
            <ul className="icons-category-grid">
              {filteredIcons.map((iconName) => {
                const Icon = (
                  icons as Record<string, (props: React.SVGProps<SVGSVGElement>) => ReactElement>
                )[iconName];

                if (!Icon) {
                  message.error(`Icon not found: ${iconName}`);
                  // biome-ignore lint/suspicious/noConsole: debugging purposes
                  console.error(`Icon not found: ${iconName}`);
                  return null;
                }
                return (
                  <li
                    key={iconName}
                    className="icons-grid__item"
                  >
                    <TransparentButton onClick={() => copyToClipboard(iconName)}>
                      <Icon className="dev-icon" />
                      <div className="dev-icon-label">{iconName}</div>
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
