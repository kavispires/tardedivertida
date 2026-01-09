import clsx from 'clsx';
import type { ReactNode } from 'react';
// Ant Design Resources
import { Space, type SpaceProps } from 'antd';
// Components
import { Title, type TitleProps } from 'components/text';
// Sass
import './TitledContainer.scss';

type TitledContainerProps = {
  title: ReactNode;
  children: ReactNode;
  contained?: boolean;
  className?: string;
  titleProps?: Omit<TitleProps, 'children'>;
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
    direction: childrenDirection = 'horizontal',
    ...restChildrenContainerProps
  } = contentProps ?? {};

  return (
    <Space
      orientation="vertical"
      className={clsx('container-wrapper', className)}
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
        orientation={childrenDirection}
        wrap={wrap}
        className={clsx(
          'container-wrapper__children',
          contained && 'container-wrapper__children--contained',
          childrenClassName,
        )}
        {...restChildrenContainerProps}
      >
        {children}
      </Space>
    </Space>
  );
}
