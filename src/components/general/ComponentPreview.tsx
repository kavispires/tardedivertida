import React, { useState, useMemo, useCallback } from 'react';
import { useWindowSize } from 'react-use';
// Ant Design Resources
import { EyeOutlined } from '@ant-design/icons';
// Internal
import { ModalOverlay } from './ModalOverlay';
// Sass
import styles from './ComponentPreview.module.scss';

type ComponentPreviewProps = {
  /**
   * The inline component to render and preview. Must be a valid React Element.
   **/
  children: React.ReactElement;
  /**
   * The width/height ratio of the component to automatically calculate the best size.
   * Example: For a card where height = width * 1.5, use 1 / 1.5
   */
  aspectRatio?: number;
  /**
   * Optional overrides for the cloned element in the preview (e.g., hiding a specific element)
   * */
  previewProps?: Record<string, unknown>;
  /**
   * Optional: Provide a completely custom React node for the preview instead of cloning children
   * */
  previewContent?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * AntD Image Preview-like component that can wrap any React element and display it in a modal with automatic scaling and transformation controls
 * Designed for previewing card-like components but flexible enough for other use cases
 * Automatically calculates optimal size based on viewport and provided aspect ratio, with sensible defaults
 * Suggested to wrap a component in a "Self-Wrapping" Pattern.
 */
export const ComponentPreview: React.FC<ComponentPreviewProps> = ({
  children,
  aspectRatio,
  previewProps,
  previewContent,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  // Automatically calculate the optimal width so it fits within 85% of the screen
  const calculatedProps = useMemo(() => {
    if (!open) return {};

    // Fallback to a 1:1 square ratio if you forget to pass one, ensuring it ALWAYS scales up
    const ratio = aspectRatio || 1;

    // 85% of the viewport ensures we have padding around the modal
    const maxPreviewWidth = windowWidth * 0.85;
    const maxPreviewHeight = windowHeight * 0.85;

    // Formula: aspect ratio = width / height => width = height * aspectRatio
    const widthConstrainedByHeight = maxPreviewHeight * ratio;

    // Pick the smaller width to ensure it doesn't overflow either axis
    const optimalWidth = Math.min(maxPreviewWidth, widthConstrainedByHeight);

    return {
      width: optimalWidth,
      // Inject height too, just in case you wrap a component that relies on height instead of width
      height: optimalWidth / ratio,
    };
  }, [aspectRatio, open, windowWidth, windowHeight]);

  const mergedPreviewProps = {
    ...calculatedProps,
    ...previewProps,
    /**
     * Indicates whether the preview modal is currently open
     */
    isPreviewOpen: open,
  };

  // Prioritize `previewContent` if provided, otherwise clone the child with the larger calculated width
  const contentForModal = previewContent
    ? previewContent
    : React.isValidElement(children)
      ? React.cloneElement(children, mergedPreviewProps as React.Attributes)
      : children;

  const handleOpenPreview = useCallback(() => setOpen(true), []);
  const handleClosePreview = useCallback(() => setOpen(false), []);

  return (
    <>
      <div
        className={styles.previewWrapper}
        onClick={handleOpenPreview}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenPreview();
          }
        }}
        role="button"
        tabIndex={0}
        {...rest}
      >
        {children}
        <div className={styles.previewMask}>
          <EyeOutlined />
          <span className={styles.previewText}>Preview</span>
        </div>
      </div>

      <ModalOverlay
        open={open}
        onClose={handleClosePreview}
      >
        {contentForModal}
      </ModalOverlay>
    </>
  );
};
