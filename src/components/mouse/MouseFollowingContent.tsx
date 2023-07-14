import clsx from 'clsx';
import { ReactNode, useEffect, useRef } from 'react';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Sass
import './MouseFollowingContent.scss';

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
};

/**
 * A React component that renders a `<div>` element that follows the mouse cursor within the browser window.
 */
export function MouseFollowingContent({ children, className = '', active }: MouseTrackedContentProps) {
  if (!active) {
    return <></>;
  }

  return <MouseFollowingContentInternal className={className}>{children}</MouseFollowingContentInternal>;
}

function MouseFollowingContentInternal({ children, className = '' }: Partial<MouseTrackedContentProps>) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (divRef.current) {
        divRef.current.style.left = e.clientX + 16 + 'px';
        divRef.current.style.top = e.clientY + 16 + 'px';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={divRef} className={clsx('mouse-following-content', getAnimationClass('bounceIn'), className)}>
      {children}
    </div>
  );
}
