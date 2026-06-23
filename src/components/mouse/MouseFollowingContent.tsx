import clsx from 'clsx';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { type ReactNode, useEffect } from 'react';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Sass
import styles from './MouseFollowingContent.module.scss';

type MouseTrackedContentProps = {
  /**
   * The content to be rendered.
   */
  children: ReactNode;
  /**
   * Optional class name to be added to the `<div>` element.
   */
  className?: string;
  /**
   * Whether the content should be rendered or not.
   */
  active?: boolean;
  /**
   * Styles the wrapper div with a `contained` class.
   */
  contained?: boolean;
};

/**
 * A React component that renders a `<div>` element that follows the mouse cursor within the browser window.
 */
export function MouseFollowingContent({
  children,
  className = '',
  contained = false,
  active,
}: MouseTrackedContentProps) {
  if (!active) {
    return null;
  }

  return (
    <MouseFollowingContentInternal
      className={className}
      contained={contained}
    >
      {children}
    </MouseFollowingContentInternal>
  );
}

function MouseFollowingContentInternal({
  children,
  contained,
  className = '',
}: Partial<MouseTrackedContentProps>) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX + 16);
      mouseY.set(e.clientY + 16);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{ left: springX, top: springY }}
      className={clsx(
        styles.mouseFollowingContent,
        contained && styles.mouseFollowingContentContained,
        getAnimationClass('bounceIn'),
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
