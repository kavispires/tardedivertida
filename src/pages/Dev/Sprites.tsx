import { useTitle } from 'react-use';
// Ant Design Resources
import { Divider, Layout, Select } from 'antd';
// Components
import { DevHeader } from './DevHeader';
import { useEffect, useState } from 'react';
import { useQueryParams } from 'hooks/useQueryParams';
import { AVAILABLE_AVATAR_IDS, AVATARS } from 'utils/avatars';
import { Avatar } from 'components/avatars';
import { makeArray } from 'utils/helpers';
import { SheepAvatar } from 'games/mente-coletiva/components/SheepAvatar';
import { CostumeAvatar } from 'games/na-rua-do-medo/components/CostumeAvatar';
import { ClubberAvatar } from 'games/megamix/components/ClubberAvatar';
import { GlyphCard } from 'components/cards/GlyphCard';
import { ItemCard } from 'components/cards/ItemCard';

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
    quantity: 25,
    startAt: 0,
  },
  clubbers: {
    key: 'clubbers',
    label: 'Clubbers',
    prefix: 'clubber',
    quantity: 60,
    startAt: 0,
  },
  glyphs: {
    key: 'glyphs',
    label: 'Glyphs',
    prefix: 'glyph',
    quantity: 365,
    startAt: 1,
  },
  items: {
    key: 'items',
    label: 'Items',
    prefix: 'item',
    quantity: 60,
    startAt: 1,
  },
};

function SpritesPage() {
  const [active, setActive] = useState(options.avatars);
  useTitle(`${active.label} Sprites | Dev | Tarde Divertida`);
  const qp = useQueryParams({ active: 'avatars' });

  useEffect(() => {
    setActive(options[qp.queryParams.active] ?? options.avatars);
  }, [qp.queryParams.active]);

  return (
    <Layout className="dev-layout">
      <DevHeader
        title={
          <Select
            onChange={(e) => qp.add('active', e)}
            value={qp.queryParams.active}
            size="small"
            style={{ minWidth: '15ch' }}
          >
            {Object.values(options).map((option) => (
              <Select.Option value={option.key} key={option.key}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        }
        subTitle={<>({active.quantity})</>}
      />
      <Layout.Content className="dev-content">
        {active.key === 'avatars' && <AvatarsContent />}
        {active.key === 'glyphs' && <GlyphsContent />}
        {active.key === 'items' && <ItemsContent />}
        {active.key !== 'avatars' && active.key !== 'glyphs' && <Content type={active.key} />}
      </Layout.Content>
    </Layout>
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
              <Avatar id={avatar.id} size={64} />
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
              <Avatar id={avatar.id} size={64} />
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

  return (
    <ul className="sprites__flex">
      {ids.map((id) => {
        return (
          <li key={`content-${id}`} className="sprites__flex-item">
            {type === 'sheep' && <SheepAvatar sheepId={String(id)} id="A" />}
            {type === 'costumes' && <CostumeAvatar costumeId={String(id)} id="A" />}
            {type === 'clubbers' && <ClubberAvatar clubberId={String(id)} id="A" />}
          </li>
        );
      })}
    </ul>
  );
}

function ItemsContent() {
  const { quantity, startAt } = options.items;

  const ids = makeArray(quantity, startAt);

  return (
    <ul className="sprites__flex">
      {ids.map((id) => {
        return (
          <li key={`costume-${id}`} className="sprites__flex-item">
            <ItemCard id={String(id)} />
            {id}
          </li>
        );
      })}
    </ul>
  );
}

function GlyphsContent() {
  const { quantity, startAt } = options.glyphs;

  const ids = makeArray(quantity, startAt);

  return (
    <ul className="sprites__flex">
      {ids.map((id) => {
        return (
          <li key={`costume-${id}`} className="sprites__flex-item">
            <GlyphCard id={String(id)} />
            {id}
          </li>
        );
      })}
    </ul>
  );
}

export default SpritesPage;
