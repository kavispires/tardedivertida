import type { CarouselRef } from 'antd/es/carousel';
import clsx from 'clsx';
import { createRef } from 'react';
import { useKeyPressEvent } from 'react-use';
// Ant Design Resources
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { Typography, Image, Carousel, Button, Space } from 'antd';
// Types
import type { GameInfo } from 'types/game-info';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { PUBLIC_URL } from 'utils/constants';
// Components
import { Translate } from 'components/language';

type RulesCarouselProps = {
  info: GameInfo;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Optional custom class name
   */
  ruleClassName?: string;
  /**
   * Optional custom class name
   */
  actionsClassName?: string;
};

export function RulesCarousel({
  info,
  className = '',
  ruleClassName = '',
  actionsClassName,
}: RulesCarouselProps) {
  const { language } = useLanguage();
  const ref = createRef<CarouselRef>();

  useKeyPressEvent('ArrowLeft', () => {
    ref.current?.prev();
  });

  useKeyPressEvent('ArrowRight', () => {
    ref.current?.next();
  });

  return (
    <div>
      <Carousel className={clsx('rules-carousel', className)} autoplay autoplaySpeed={15000} ref={ref}>
        {info.rules[language].map((rule, index) => (
          <div className={clsx('rules-carousel__rule', className)} key={rule}>
            <span className="rules-carousel__rule-number">{index + 1}</span>

            <Image
              className="rules-carousel__image"
              src={
                index === 0
                  ? `${PUBLIC_URL.BANNERS}${info.gameName}-${language}.jpg`
                  : `${PUBLIC_URL.RULES}game-rule-${info.gameName}-${index}.jpg`
              }
              fallback={`${PUBLIC_URL.RULES}game-rule-not-found.jpg`}
              alt={rule}
            />
            <Typography.Paragraph className={clsx('rules-carousel__rule-text', ruleClassName)}>
              {rule}
            </Typography.Paragraph>
          </div>
        ))}
      </Carousel>
      <Space className={clsx('space-container', actionsClassName)}>
        <Button type="default" ghost onClick={() => ref.current?.prev()} size="small">
          <DoubleLeftOutlined /> <Translate pt="Regra Anterior" en="Previous Rule" />
        </Button>
        <Button type="default" ghost onClick={() => ref.current?.next()} size="small">
          <Translate pt="Próxima Regra" en="Next Rule" /> <DoubleRightOutlined />
        </Button>
      </Space>
    </div>
  );
}
