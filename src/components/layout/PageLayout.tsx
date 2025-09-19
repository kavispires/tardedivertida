import clsx from 'clsx';
import { motion } from 'motion/react';
import type { ComponentProps } from 'react';
// Ant Design Resources
import { Layout } from 'antd';
// Sass
import './PageLayout.scss';

const MotionLayout = motion.create(Layout);

const OPEN = 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)';
const CLOSE = 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)';

/**
 * A page layout component that uses Framer Motion for animations.
 */
export const PageLayout = ({ className, ...props }: ComponentProps<typeof MotionLayout>) => {
  return (
    <MotionLayout
      initial="initialState"
      animate="animateState"
      exit="exitState"
      transition={{
        duration: 0.25,
        ease: 'easeOut',
      }}
      variants={{
        initialState: {
          clipPath: CLOSE,
        },
        animateState: {
          clipPath: OPEN,
        },
        exitState: {
          clipPath: CLOSE,
        },
      }}
      className={clsx('page-layout', className)}
      {...props}
    />
  );
};

/**
 * A loading page layout component that uses Framer Motion for animations.
 * Only animates the exit
 */
export const LoadingPageLayout = (props: ComponentProps<typeof MotionLayout>) => {
  return (
    <MotionLayout
      initial="initialState"
      animate="animateState"
      exit="exitState"
      transition={{
        duration: 0.25,
        ease: 'easeOut',
      }}
      variants={{
        initialState: {
          opacity: 0,
          clipPath: OPEN,
        },
        animateState: {
          opacity: 1,
          clipPath: OPEN,
        },
        exitState: {
          opacity: 1,
          clipPath: CLOSE,
        },
      }}
      {...props}
    />
  );
};
