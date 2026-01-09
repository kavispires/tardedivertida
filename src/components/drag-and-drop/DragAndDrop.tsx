import { useDraggable, useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Props for the DroppableArea component
 */
interface DroppableAreaProps {
  /** Unique identifier for the droppable area */
  id: string | number;

  /** The content to be rendered inside the droppable area */
  children: ReactNode;

  /** Whether the area is currently disabled for dropping */
  disabled?: boolean;

  /** Custom CSS class to apply to the droppable element */
  className?: string;

  /** Custom CSS styles to apply to the droppable element */
  style?: CSSProperties;

  /** Custom CSS class to apply when an item is being dragged over the area */
  overClassName?: string;

  /** Custom styles to apply when an item is being dragged over the area */
  overStyle?: CSSProperties;

  /** Optional callback when an item is dragged over the area */
  onDragOver?: () => void;

  /** Optional callback when an item leaves the area */
  onDragLeave?: () => void;

  /** Options for customizing the drop behavior */
  options?: {
    /** Whether to use transition effects */
    withTransition?: boolean;

    /** Scale factor to apply when hovered */
    hoverScale?: number;

    /** Custom highlight color when hovered */
    highlightColor?: string;

    /** Custom highlight thickness when hovered */
    highlightThickness?: number;
  };

  /** Optional data attribute for testing or custom selectors */
  dataAttributes?: Record<string, string>;
}

/**
 * A generic, customizable droppable area component using dnd-kit
 */
export function DroppableArea({
  id,
  children,
  disabled = false,
  className,
  style,
  overClassName,
  overStyle,
  onDragOver,
  onDragLeave,
  options = {},
  dataAttributes,
}: DroppableAreaProps) {
  // Set default options
  const {
    withTransition = true,
    hoverScale = 1.05,
    highlightColor = 'gold',
    highlightThickness = 3,
  } = options;

  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled,
  });

  // Call callbacks when drag state changes
  if (isOver && onDragOver) {
    onDragOver();
  } else if (!isOver && onDragLeave) {
    onDragLeave();
  }

  // Base styles for the droppable area
  const baseStyle: CSSProperties = {
    position: 'relative',
    ...(withTransition && { transition: 'all 0.2s ease' }),
    ...style,
  };

  // Apply hover styles when an item is being dragged over
  const elementStyle: CSSProperties = {
    ...baseStyle,
    ...(isOver &&
      !disabled && {
        boxShadow: `0 0 0 ${highlightThickness}px ${highlightColor}`,
        transform: `scale(${hoverScale})`,
        ...overStyle,
      }),
  };

  // Build the combined class names
  const combinedClassName = clsx(
    'droppable-area',
    className,
    isOver && !disabled && 'droppable-area--active',
    isOver && !disabled && overClassName,
    disabled && 'droppable-area--disabled',
  );

  // Prepare any data attributes
  const dataProps: Record<string, string> = {
    'data-droppable-id': String(id),
    'data-droppable-active': isOver ? 'true' : 'false',
    'data-droppable-disabled': disabled ? 'true' : 'false',
    ...dataAttributes,
  };

  return (
    <div
      ref={setNodeRef}
      style={elementStyle}
      className={combinedClassName}
      {...dataProps}
    >
      {children}
    </div>
  );
}

/**
 * Props for the DraggableItem component
 */
interface DraggableItemProps {
  /** Unique identifier for the draggable item */
  id: string | number;

  /** The content to be rendered inside the draggable item */
  children: ReactNode;

  /** Whether the item is currently disabled for dragging */
  disabled?: boolean;

  /** Custom CSS class to apply to the draggable element */
  className?: string;

  /** Custom CSS styles to apply to the draggable element */
  style?: CSSProperties;

  /** Custom CSS class to apply when the item is being dragged */
  dragClassName?: string;

  /** Custom styles to apply when the item is being dragged */
  dragStyle?: CSSProperties;

  /** Called when the draggable item is clicked */
  onClick?: () => void;

  /** Optional custom drag handle element */
  dragHandle?: ReactNode;

  /** Options for customizing the drag behavior */
  options?: {
    /** Whether to use transition effects when dragging */
    withTransition?: boolean;

    /** Scale factor to apply when dragging */
    dragScale?: number;
    /**
     * Rotation angle to apply when dragging (in degrees)
     */
    dragRotate?: number;

    /** Opacity to apply when dragging */
    dragOpacity?: number;
  };

  /** CSS class for the wrapper element */
  wrapperClassName?: string;

  /** Custom styles for the wrapper element */
  wrapperStyle?: CSSProperties;
}

/**
 * A generic, customizable draggable item component using dnd-kit
 * Supports custom styling, drag handles, and various behavior options
 */
export function DraggableItem({
  id,
  children,
  disabled = false,
  className,
  style,
  dragClassName,
  dragStyle,
  onClick,
  dragHandle,
  options = {},
  wrapperClassName,
  wrapperStyle,
}: DraggableItemProps) {
  // Set default options
  const { withTransition = true, dragScale = 1.05, dragOpacity = 0.8, dragRotate = 0 } = options;

  // Use dnd-kit's useDraggable hook
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });

  // Build the style for the draggable element
  const elementStyle: CSSProperties = {
    ...style,
    ...(isDragging && dragStyle),
  };

  // Apply transform styles when dragging
  if (transform) {
    elementStyle.transform = `translate3d(${transform.x}px, ${transform.y}px, 0)`;

    if (isDragging) {
      elementStyle.zIndex = 999;
      elementStyle.opacity = dragOpacity;
      elementStyle.transform += ` scale(${dragScale}) rotate(${dragRotate}deg)`;
    }

    if (withTransition && !isDragging) {
      elementStyle.transition = 'transform 0.2s ease';
    }
  }

  // Build the combined class names
  const combinedClassName = clsx(
    'draggable-item',
    className,
    isDragging && dragClassName,
    isDragging && 'draggable-item--dragging',
  );

  // Handle click events
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  // Wrapper styles
  const wrapperStyleObj: CSSProperties = {
    position: 'relative',
    ...wrapperStyle,
  };

  if (dragHandle) {
    // With custom drag handle
    return (
      <div
        className={clsx('draggable-item-wrapper', wrapperClassName)}
        style={wrapperStyleObj}
      >
        <button
          ref={setNodeRef}
          type="button"
          style={elementStyle}
          onClick={handleClick}
          className={combinedClassName}
          disabled={disabled}
          {...attributes}
        >
          <span
            className="draggable-item-handle"
            {...listeners}
          >
            {dragHandle}
          </span>
          <span className="draggable-item-content">{children}</span>
        </button>
      </div>
    );
  }

  // Standard draggable (whole item is draggable)
  return (
    <div
      className={clsx('draggable-item-wrapper', wrapperClassName)}
      style={wrapperStyleObj}
    >
      <button
        ref={setNodeRef}
        type="button"
        style={elementStyle}
        onClick={handleClick}
        className={combinedClassName}
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        {children}
      </button>
    </div>
  );
}
