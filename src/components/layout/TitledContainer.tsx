import clsx from 'clsx';
import type { ReactNode } from 'react';
// Ant Design Resources
import { Space, type SpaceProps } from 'antd';
// Components
import { Title, type TitleProps } from 'components/text';
// Sass
import styles from './TitledContainer.module.scss';

type TitledContainerProps = {
  /**
   * The title of the container
   */
  title: ReactNode;
  /**
   * The content to render inside the container
   */
  children: ReactNode;
  /**
   * Whether to contain the children in a bordered box
   */
  contained?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Props to pass to the Title component
   */
  titleProps?: Omit<TitleProps, 'children'>;
  /**
   * Props to pass to the content Space component
   */
  contentProps?: SpaceProps;
} & Omit<SpaceProps, 'title' | 'children'>;

/**
 * Container component with title and center aligned children
 */
export function TitledContainer({
  title,
  children,
  className,
  contained,
  titleProps,
  contentProps,
  ...spaceProps
}: TitledContainerProps) {
  const { level = 4, size = 'xx-small', ...restTitleProps } = titleProps ?? {};

  const {
    className: childrenClassName,
    wrap = true,
    orientation: childrenOrientation = 'horizontal',
    ...restChildrenContainerProps
  } = contentProps ?? {};

  return (
    <Space
      orientation="vertical"
      className={clsx(styles.containerWrapper, className)}
      {...spaceProps}
    >
      <Title
        level={level}
        size={size}
        {...restTitleProps}
      >
        {title}
      </Title>

      <Space
        orientation={childrenOrientation}
        wrap={wrap}
        className={clsx(
          styles.containerWrapperChildren,
          contained && styles.containerWrapperChildrenContained,
          childrenClassName,
        )}
        {...restChildrenContainerProps}
      >
        {children}
      </Space>
    </Space>
  );
}
