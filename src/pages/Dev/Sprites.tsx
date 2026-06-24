import { SheepAvatar } from '@games/mente-coletiva/components/SheepAvatar';
import { orderBy, truncate } from 'lodash';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCopyToClipboard, useTitle } from 'react-use';
// Ant Design Resources
import { App, Button, Col, Divider, Flex, Layout, Row, Select, Tag, type TagProps } from 'antd';
// Hooks
import { useQueryParams } from '@hooks/useQueryParams';
// Utils
import { AVAILABLE_AVATAR_IDS, AVATARS } from '@utils/avatars';
import { makeArray } from '@utils/helpers';
// Components
import { Medal } from '@components/achievements/Medal';
import { ClubberAvatar } from '@components/avatars/ClubberAvatar';
import { CostumeAvatar } from '@components/avatars/CostumeAvatar';
import { SuperHeroAvatar } from '@components/avatars/SuperHeroAvatar';
import { EmojiCard } from '@components/cards/EmojiCard';
import { TreeCard } from '@components/cards/TreeCard';
import { PageLayout } from '@components/layout/PageLayout';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
// Internal
import { MEDALS_IDS } from './utils/constants';
import { DevHeader } from './DevHeader';

type SpriteOption = {
  key: string;
  label: string;
  prefix: string;
  quantity: number;
  extra?: string[];
  startAt: number;
};

const options: Record<string, SpriteOption> = {
  avatars: {
    key: 'avatars',
    label: 'Avatars',
    prefix: 'avatar',
    quantity: 50,
    extra: ['A', 'B', 'C', 'D', 'E', 'N'],
    startAt: 0,
  },
  sheep: {
    key: 'sheep',
    label: 'Sheep',
    prefix: 'sheep-face',
    quantity: 25,
    startAt: 0,
  },
  costumes: {
    key: 'costumes',
    label: 'Costumes',
    prefix: 'costume',
    quantity: 50,
    startAt: 0,
  },
  clubbers: {
    key: 'clubbers',
    label: 'Clubbers',
    prefix: 'clubber',
    quantity: 60,
    startAt: 0,
  },
  'super-heroes': {
    key: 'super-heroes',
    label: 'Super Heroes',
    prefix: 'super-hero',
    quantity: 50,
    startAt: 0,
  },
  trees: {
    key: 'trees',
    label: 'Trees',
    prefix: 'tree',
    quantity: 15,
    startAt: 1,
  },
  emojis: {
    key: 'emojis',
    label: 'Emojis',
    prefix: 'emoji',
    quantity: 30,
    startAt: 1,
  },
  medals: {
    key: 'medals',
    label: 'Medals',
    prefix: 'medal',
    quantity: 100,
    startAt: 1,
  },
};

function useCopyToClipboardFunction() {
  const [state, copyToClipboard] = useCopyToClipboard();
  const { message } = App.useApp();

  useEffect(() => {
    if (state.value) {
      if (state.value.length > 20) {
        message.info(`Copied to clipboard: ${truncate(state.value, { length: 30, omission: '...' })}`);
      } else {
        message.success('Copied');
      }
    }
  }, [state, message]);

  return copyToClipboard;
}

function CopyValue(props: TagProps & { withQuotes?: boolean }) {
  const copyToClipboard = useCopyToClipboardFunction();
  const value = props.withQuotes
    ? `"${props.children?.toString() ?? ''}"`
    : (props.children?.toString() ?? '');

  return (
    <Tag
      onClick={() => copyToClipboard(value)}
      styles={{ root: { background: 'transparent', cursor: 'pointer' } }}
      {...props}
    />
  );
}

const optionsList = orderBy(Object.values(options), ['label'], ['asc']);

function SpritesPage() {
  const [active, setActive] = useState(options.avatars);
  useTitle(`${active.label} Sprites | Dev | Tarde Divertida`);
  const { queryParams, addParam } = useQueryParams({ active: 'avatars' });
  const activeType = queryParams.get('active') || 'avatars';

  useEffect(() => {
    setActive(options[activeType] ?? options.avatars);
  }, [activeType]);

  const activeContent = {
    avatars: <AvatarsContent />,
    medals: <MedalsContent />,
    trees: <TreeContent />,
    emojis: <EmojisContent />,
  }?.[active.key] ?? <Content type={active.key} />;

  return (
    <PageLayout className="dev-layout">
      <DevHeader
        title={
          <Select
            onChange={(e) => addParam('active', e)}
            value={activeType}
            size="small"
            style={{ minWidth: '15ch' }}
            options={optionsList.map((option) => ({
              value: option.key,
              key: option.key,
              label: option.label,
            }))}
          />
        }
        subTitle={
          <>
            ({active.quantity}){active.key === 'items' && <Link to="/dev/classifier"> Classifier</Link>}
          </>
        }
      />
      <Layout.Content className="dev-content">{activeContent}</Layout.Content>
    </PageLayout>
  );
}

function AvatarsContent() {
  const AI_AVATARS = Object.keys(AVATARS).filter((id) => !AVAILABLE_AVATAR_IDS.includes(id));

  return (
    <>
      <ul className="sprites__grid-5">
        {AVAILABLE_AVATAR_IDS.map((avatarId) => {
          const avatar = AVATARS[avatarId];
          return (
            <li
              key={avatar.id}
              className="sprites__avatar-grid-item"
              style={{ backgroundColor: avatar.color }}
            >
              <div style={{ overflow: 'hidden', textAlign: 'center' }}>[{avatar.id}]</div>
              <PlayerAvatar
                avatarId={avatar.id}
                size={64}
              />
              <div style={{ overflow: 'hidden', textAlign: 'center' }}>
                <p>
                  {avatar.description.en}
                  <br />
                  {avatar.description.pt}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <Divider />
      <ul className="sprites__grid-5">
        {AI_AVATARS.map((avatarId) => {
          const avatar = AVATARS[avatarId];
          return (
            <li
              key={avatar.id}
              className="sprites__avatar-grid-item"
              style={{ backgroundColor: avatar.color }}
            >
              <PlayerAvatar
                avatarId={avatar.id}
                size={64}
              />
              <div style={{ overflow: 'hidden', textAlign: 'center' }}>
                <p>
                  {avatar.description.en}
                  <br />
                  {avatar.description.pt}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function Content({ type }: { type: string }) {
  const { quantity, startAt } = options[type];

  const ids = makeArray(quantity, startAt);
  const placeholder = 'A';
  return (
    <ul className="sprites__flex">
      {ids.map((id) => {
        return (
          <li
            key={`content-${id}`}
            className="sprites__flex-item"
          >
            {type === 'sheep' && (
              <SheepAvatar
                sheepId={String(id)}
                id={placeholder}
              />
            )}
            {type === 'costumes' && (
              <CostumeAvatar
                id={String(id)}
                avatarId={placeholder}
              />
            )}
            {type === 'clubbers' && (
              <ClubberAvatar
                id={String(id)}
                avatarId={placeholder}
              />
            )}
            {type === 'super-heroes' && (
              <SuperHeroAvatar
                id={String(id)}
                avatarId={placeholder}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function EmojisContent() {
  const { quantity, startAt } = options.emojis;

  const ids = makeArray(quantity, startAt);

  return (
    <ul className="sprites__flex">
      {ids.map((id) => {
        return (
          <li
            key={`items-${id}`}
            className="sprites__flex-item"
          >
            <EmojiCard emojiId={String(id)} />
            <CopyValue>{id}</CopyValue>
          </li>
        );
      })}
    </ul>
  );
}

function MedalsContent() {
  const copyToClipboard = useCopyToClipboardFunction();

  return (
    <>
      <Flex>
        <Button
          size="small"
          onClick={() => copyToClipboard(MEDALS_IDS.join(', '))}
        >
          Copy all ids
        </Button>
      </Flex>
      <Row gutter={8}>
        {MEDALS_IDS.map((id) => {
          return (
            <Col
              xs={6}
              sm={6}
              md={4}
              lg={4}
              xl={2}
              key={`medal-${id}`}
              className="sprites__col"
            >
              <Medal
                id={String(id)}
                width={100}
              />
              <CopyValue>{id}</CopyValue>
            </Col>
          );
        })}
      </Row>
    </>
  );
}

function TreeContent() {
  const { quantity, startAt } = options.trees;

  const ids = makeArray(quantity, startAt);

  return (
    <ul className="sprites__flex">
      {ids.map((id) => {
        return (
          <li
            key={`tree-${id}`}
            className="sprites__flex-item"
          >
            <TreeCard treeId={id} />
            <CopyValue>{id}</CopyValue>
          </li>
        );
      })}
    </ul>
  );
}

export default SpritesPage;
