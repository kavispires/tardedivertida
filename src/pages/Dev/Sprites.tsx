import { useTitle } from 'react-use';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
// Ant Design Resources
import { Col, Divider, Layout, Row, Select } from 'antd';
// Hooks
import { useQueryParams } from 'hooks/useQueryParams';
// Utils
import { AVAILABLE_AVATAR_IDS, AVATARS } from 'utils/avatars';
import { makeArray } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';
import { SheepAvatar } from 'games/mente-coletiva/components/SheepAvatar';
import { CostumeAvatar } from 'games/na-rua-do-medo/components/CostumeAvatar';
import { ClubberAvatar } from 'games/megamix/components/ClubberAvatar';
import { GlyphCard } from 'components/cards/GlyphCard';
import { ItemCard } from 'components/cards/ItemCard';
import { DevHeader } from './DevHeader';
import { MEDALS_IDS } from './utils/constants';
import { Medal } from 'components/general/Medal';

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
    quantity: 250,
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

function SpritesPage() {
  const [active, setActive] = useState(options.avatars);
  useTitle(`${active.label} Sprites | Dev | Tarde Divertida`);
  const qp = useQueryParams({ active: 'avatars' });

  useEffect(() => {
    setActive(options[qp.queryParams.active] ?? options.avatars);
  }, [qp.queryParams.active]);

  const activeContent = {
    avatars: <AvatarsContent />,
    glyphs: <GlyphsContent />,
    items: <ItemsContent />,
    medals: <MedalsContent />,
  }?.[active.key] ?? <Content type={active.key} />;

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
        subTitle={
          <>
            ({active.quantity}){active.key === 'items' && <Link to="/dev/classifier"> Classifier</Link>}
          </>
        }
      />
      <Layout.Content className="dev-content">{activeContent}</Layout.Content>
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

function MedalsContent() {
  return (
    <Row gutter={8}>
      {MEDALS_IDS.map((id) => {
        return (
          <Col xs={6} sm={6} md={4} lg={4} xl={2} key={`medal-${id}`} className="sprites__col">
            {/* <li key={`medal-${id}`} className="sprites__flex-item"> */}
            <Medal id={String(id)} />
            {id}
            {/* </li> */}
          </Col>
        );
      })}
    </Row>
  );
}

export default SpritesPage;
