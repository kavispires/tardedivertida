import { Suspense, lazy } from 'react';
import clsx from 'clsx';
// Ant Design Resources
import { Spin } from 'antd';
// Sass
import './ItemCard.scss';
// Lazy Items Components
const AliemItemSprite64 = lazy(() => import('./AlienItemSprites/AlienItemSprite64'));
const AliemItemSprite128 = lazy(() => import('./AlienItemSprites/AlienItemSprite128'));
const AliemItemSprite192 = lazy(() => import('./AlienItemSprites/AlienItemSprite192'));
const AliemItemSprite256 = lazy(() => import('./AlienItemSprites/AlienItemSprite256'));
const AliemItemSprite320 = lazy(() => import('./AlienItemSprites/AlienItemSprite320'));
const AliemItemSprite384 = lazy(() => import('./AlienItemSprites/AlienItemSprite384'));
const AliemItemSprite448 = lazy(() => import('./AlienItemSprites/AlienItemSprite448'));
const AliemItemSprite512 = lazy(() => import('./AlienItemSprites/AlienItemSprite512'));
const AliemItemSprite576 = lazy(() => import('./AlienItemSprites/AlienItemSprite576'));
const AliemItemSprite640 = lazy(() => import('./AlienItemSprites/AlienItemSprite640'));
const AliemItemSprite704 = lazy(() => import('./AlienItemSprites/AlienItemSprite704'));
const AliemItemSprite768 = lazy(() => import('./AlienItemSprites/AlienItemSprite768'));
const AliemItemSprite832 = lazy(() => import('./AlienItemSprites/AlienItemSprite832'));
const AliemItemSprite896 = lazy(() => import('./AlienItemSprites/AlienItemSprite896'));
const AliemItemSprite960 = lazy(() => import('./AlienItemSprites/AlienItemSprite960'));
const AliemItemSprite1024 = lazy(() => import('./AlienItemSprites/AlienItemSprite1024'));
const AliemItemSprite1088 = lazy(() => import('./AlienItemSprites/AlienItemSprite1088'));

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
    <AliemItemSprite64 {...props} />
  </Suspense>
);

const Lazy128 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite128 {...props} />
  </Suspense>
);

const Lazy192 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite192 {...props} />
  </Suspense>
);

const Lazy256 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite256 {...props} />
  </Suspense>
);

const Lazy320 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite320 {...props} />
  </Suspense>
);

const Lazy384 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite384 {...props} />
  </Suspense>
);

const Lazy448 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite448 {...props} />
  </Suspense>
);

const Lazy512 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite512 {...props} />
  </Suspense>
);

const Lazy576 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite576 {...props} />
  </Suspense>
);

const Lazy640 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite640 {...props} />
  </Suspense>
);

const Lazy704 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite704 {...props} />
  </Suspense>
);

const Lazy768 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite768 {...props} />
  </Suspense>
);

const Lazy832 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite832 {...props} />
  </Suspense>
);

const Lazy896 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite896 {...props} />
  </Suspense>
);

const Lazy960 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite960 {...props} />
  </Suspense>
);

const Lazy1024 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite1024 {...props} />
  </Suspense>
);

const Lazy1088 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite1088 {...props} />
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

  return (
    <div
      className={clsx('item-card', props.className)}
      style={{ width: `${props.width ?? 75}px`, height: `${props.width ?? 75}px` }}
    >
      <div className="item-card__loading">?</div>
    </div>
  );
}
