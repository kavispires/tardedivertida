import { Suspense, lazy } from 'react';
import clsx from 'clsx';
// Ant Design Resources
import { Spin } from 'antd';
// Sass
import './ItemCard.scss';
// Lazy Items Components
const AlienItemSprite64 = lazy(() => import('./AlienItemSprites/AlienItemSprite64'));
const AlienItemSprite128 = lazy(() => import('./AlienItemSprites/AlienItemSprite128'));
const AlienItemSprite192 = lazy(() => import('./AlienItemSprites/AlienItemSprite192'));
const AlienItemSprite256 = lazy(() => import('./AlienItemSprites/AlienItemSprite256'));
const AlienItemSprite320 = lazy(() => import('./AlienItemSprites/AlienItemSprite320'));
const AlienItemSprite384 = lazy(() => import('./AlienItemSprites/AlienItemSprite384'));
const AlienItemSprite448 = lazy(() => import('./AlienItemSprites/AlienItemSprite448'));
const AlienItemSprite512 = lazy(() => import('./AlienItemSprites/AlienItemSprite512'));
const AlienItemSprite576 = lazy(() => import('./AlienItemSprites/AlienItemSprite576'));
const AlienItemSprite640 = lazy(() => import('./AlienItemSprites/AlienItemSprite640'));
const AlienItemSprite704 = lazy(() => import('./AlienItemSprites/AlienItemSprite704'));
const AlienItemSprite768 = lazy(() => import('./AlienItemSprites/AlienItemSprite768'));
const AlienItemSprite832 = lazy(() => import('./AlienItemSprites/AlienItemSprite832'));
const AlienItemSprite896 = lazy(() => import('./AlienItemSprites/AlienItemSprite896'));
const AlienItemSprite960 = lazy(() => import('./AlienItemSprites/AlienItemSprite960'));
const AlienItemSprite1024 = lazy(() => import('./AlienItemSprites/AlienItemSprite1024'));
const AlienItemSprite1088 = lazy(() => import('./AlienItemSprites/AlienItemSprite1088'));
const AlienItemSprite1152 = lazy(() => import('./AlienItemSprites/AlienItemSprite1152'));

export type ItemCardProps = {
  /**
   * The id of the item
   */
  id: string;
  /**
   * The width of the item
   */
  width?: number;
  /**
   * Optional class name
   */
  className?: string;
};

const LoadingItem = (props: ItemCardProps) => (
  <div
    className={clsx('item-card', props.className)}
    style={{ width: `${props.width ?? 75}px`, height: `${props.width ?? 75}px` }}
  >
    <div className="item-card__loading">
      <Spin />
    </div>
  </div>
);

const Lazy64 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite64 {...props} />
  </Suspense>
);

const Lazy128 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite128 {...props} />
  </Suspense>
);

const Lazy192 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite192 {...props} />
  </Suspense>
);

const Lazy256 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite256 {...props} />
  </Suspense>
);

const Lazy320 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite320 {...props} />
  </Suspense>
);

const Lazy384 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite384 {...props} />
  </Suspense>
);

const Lazy448 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite448 {...props} />
  </Suspense>
);

const Lazy512 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite512 {...props} />
  </Suspense>
);

const Lazy576 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite576 {...props} />
  </Suspense>
);

const Lazy640 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite640 {...props} />
  </Suspense>
);

const Lazy704 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite704 {...props} />
  </Suspense>
);

const Lazy768 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite768 {...props} />
  </Suspense>
);

const Lazy832 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite832 {...props} />
  </Suspense>
);

const Lazy896 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite896 {...props} />
  </Suspense>
);

const Lazy960 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite960 {...props} />
  </Suspense>
);

const Lazy1024 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite1024 {...props} />
  </Suspense>
);

const Lazy1088 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite1088 {...props} />
  </Suspense>
);

const Lazy1152 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AlienItemSprite1152 {...props} />
  </Suspense>
);

export function ItemCard(props: ItemCardProps) {
  const numId = Number(props.id);

  if (numId <= 64) return <Lazy64 {...props} />;
  if (numId <= 128) return <Lazy128 {...props} />;
  if (numId <= 192) return <Lazy192 {...props} />;
  if (numId <= 256) return <Lazy256 {...props} />;
  if (numId <= 320) return <Lazy320 {...props} />;
  if (numId <= 384) return <Lazy384 {...props} />;
  if (numId <= 448) return <Lazy448 {...props} />;
  if (numId <= 512) return <Lazy512 {...props} />;
  if (numId <= 576) return <Lazy576 {...props} />;
  if (numId <= 640) return <Lazy640 {...props} />;
  if (numId <= 704) return <Lazy704 {...props} />;
  if (numId <= 768) return <Lazy768 {...props} />;
  if (numId <= 832) return <Lazy832 {...props} />;
  if (numId <= 896) return <Lazy896 {...props} />;
  if (numId <= 960) return <Lazy960 {...props} />;
  if (numId <= 1024) return <Lazy1024 {...props} />;
  if (numId <= 1088) return <Lazy1088 {...props} />;
  if (numId <= 1152) return <Lazy1152 {...props} />;

  return (
    <div
      className={clsx('item-card', props.className)}
      style={{ width: `${props.width ?? 75}px`, height: `${props.width ?? 75}px` }}
    >
      <div className="item-card__loading">?</div>
    </div>
  );
}
