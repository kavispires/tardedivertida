import clsx from 'clsx';
import type { ComponentProps } from 'react';
// Ant Design Resources
import { Layout } from 'antd';
// Sass
import styles from './PageLayout.module.scss';

/**
 * A layout component for application pages.
 */
export const PageLayout = ({ className, ...props }: ComponentProps<typeof Layout>) => {
  return (
    <Layout
      className={clsx(styles.pageLayout, className)}
      {...props}
    />
  );
};

/**
 * A layout component for loading pages.
 */
export const LoadingPageLayout = (props: ComponentProps<typeof Layout>) => <Layout {...props} />;
