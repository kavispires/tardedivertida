import { Suspense, lazy } from 'react';
import clsx from 'clsx';
// Sass
import './ItemCard.scss';
import { Spin } from 'antd';
// Lazy Items Components
const AliemItemSprite128 = lazy(() => import('./AlienItemSprites/AlienItemSprite128'));
const AliemItemSprite256 = lazy(() => import('./AlienItemSprites/AlienItemSprite256'));
const AliemItemSprite384 = lazy(() => import('./AlienItemSprites/AlienItemSprite384'));
const AliemItemSprite512 = lazy(() => import('./AlienItemSprites/AlienItemSprite512'));
const AliemItemSprite640 = lazy(() => import('./AlienItemSprites/AlienItemSprite640'));

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

const Lazy128 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite128 {...props} />
  </Suspense>
);

const Lazy256 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite256 {...props} />
  </Suspense>
);

const Lazy384 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite384 {...props} />
  </Suspense>
);

const Lazy512 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite512 {...props} />
  </Suspense>
);

const Lazy640 = (props: ItemCardProps) => (
  <Suspense fallback={<LoadingItem {...props} />}>
    <AliemItemSprite640 {...props} />
  </Suspense>
);

export function ItemCard(props: ItemCardProps) {
  const numId = Number(props.id);

  if (numId <= 128) {
    return <Lazy128 {...props} />;
  }

  if (numId <= 256) {
    return <Lazy256 {...props} />;
  }

  if (numId <= 384) {
    return <Lazy384 {...props} />;
  }

  if (numId <= 512) {
    return <Lazy512 {...props} />;
  }

  if (numId <= 640) {
    return <Lazy640 {...props} />;
  }

  return (
    <div
      className={clsx('item-card', props.className)}
      style={{ width: `${props.width ?? 75}px`, height: `${props.width ?? 75}px` }}
    >
      <div className="item-card__loading">?</div>
    </div>
  );
}
