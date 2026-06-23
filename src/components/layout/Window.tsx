import { DndContext, useDraggable, type DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, type ReactNode } from 'react';
import { useWindowSize } from 'react-use';
// Ant Design Resources
import { CloseOutlined, DragOutlined } from '@ant-design/icons';
import { Button } from 'antd';
// Hooks
import { useQueryParams } from '@hooks/useQueryParams';
// Sass
import styles from './Window.module.scss';

type WindowProps = {
  /**
   * Unique identifier for the window, used for managing query params and session storage
   */
  windowId: string;
  /**
   * Content to render inside the window
   */
  children: ReactNode;
  /**
   * Title displayed in the window header
   */
  title: ReactNode;
  /**
   * Index for cascading windows (affects initial position)
   */
  index?: number;
  /**
   * Default width and height for the window (default: 400x300)
   */
  defaultSize?: { width: number; height: number };
};

type WindowState = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * A draggable, resizable window component that can be opened and closed via query params.
 * Supports cascading initial positions and persists position in session storage.
 */
export const Window: React.FC<WindowProps> = ({
  windowId,
  title,
  children,
  defaultSize = { width: 400, height: 300 },
  index = 0,
}) => {
  const { is, removeParam } = useQueryParams();
  const { width: winW, height: winH } = useWindowSize();

  const isOpen = is(windowId, 'true');

  const [state, setState] = useState<WindowState>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(`window_pos_${windowId}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Failed to parse saved position, use default
        }
      }
    }

    const offset = index * 24;

    return {
      x: 50 + offset,
      y: 50 + offset,
      ...defaultSize,
    };
  });

  useEffect(() => {
    if (isOpen) {
      const maxX = Math.max(0, winW - state.width);
      const maxY = Math.max(0, winH - state.height);

      const safeX = Math.min(Math.max(0, state.x), maxX);
      const safeY = Math.min(Math.max(0, state.y), maxY);

      if (safeX !== state.x || safeY !== state.y) {
        setState((prev) => ({ ...prev, x: safeX, y: safeY }));
      }

      sessionStorage.setItem(`window_pos_${windowId}`, JSON.stringify(state));
    }
  }, [state, winW, winH, isOpen, windowId]);

  const handleDragEnd = (event: DragEndEvent) => {
    setState((prev) => ({
      ...prev,
      x: prev.x + event.delta.x,
      y: prev.y + event.delta.y,
    }));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <AnimatePresence>
        {isOpen && (
          <DraggableWindow
            windowId={windowId}
            state={state}
            title={title}
            onClose={() => removeParam(windowId)}
          >
            {children}
          </DraggableWindow>
        )}
      </AnimatePresence>
    </DndContext>
  );
};

type DraggableWindowProps = {
  /**
   * Unique identifier for the window
   */
  windowId: string;
  /**
   * Current position and size of the window
   */
  state: WindowState;
  /**
   * Title displayed in the window header
   */
  title: ReactNode;
  /**
   * Content to render inside the window
   */
  children: ReactNode;
  /**
   * Callback to close the window
   */
  onClose: () => void;
};

const DraggableWindow: React.FC<DraggableWindowProps> = ({ windowId, state, title, children, onClose }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: windowId,
  });

  const style: React.CSSProperties = {
    left: state.x,
    top: state.y,
    width: state.width,
    height: state.height,
    transform: transform ? CSS.Translate.toString(transform) : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.window}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={styles.windowContainer}
      >
        <div className={styles.windowHeader}>
          <div
            {...listeners}
            {...attributes}
            className={styles.windowHeaderDrag}
          >
            <DragOutlined className={styles.windowDragIcon} />
            <span className={styles.windowTitle}>{title}</span>
          </div>
          <Button
            type="text"
            size="small"
            shape="circle"
            icon={<CloseOutlined className={styles.windowCloseIcon} />}
            onClick={onClose}
            onPointerDown={(e) => e.stopPropagation()}
          />
        </div>

        <div className={styles.windowContent}>{children}</div>
      </motion.div>
    </div>
  );
};
