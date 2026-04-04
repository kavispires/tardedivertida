import type { CarouselRef } from 'antd/es/carousel';
import clsx from 'clsx';
import { createRef } from 'react';
import { useKeyPressEvent } from 'react-use';
// Ant Design Resources
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { Typography, Image, Carousel, Button } from 'antd';
// Types
import type { GameInfo } from 'types/game-info';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Utils
import { PUBLIC_URL } from 'utils/constants';
// Components
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Sass
import styles from './rules.module.scss';

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
  const BASE_URL = useTDBaseUrl('assets');
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
      <Carousel
        className={clsx(styles.rulesCarousel, className)}
        autoplay
        autoplaySpeed={15000}
        ref={ref}
      >
        {info.rules[language].map((rule, index) => (
          <div
            className={clsx(styles.rulesCarousel__rule, className)}
            key={rule}
          >
            <span className={styles.rulesCarousel__ruleNumber}>{index + 1}</span>

            <Image
              className={styles.rulesCarousel__image}
              src={
                index === 0
                  ? `${PUBLIC_URL.BANNERS}${info.gameName}.jpg`
                  : `${BASE_URL}/rules/game-rule-${info.gameName}-${index}.jpg`
              }
              fallback={`${BASE_URL}/rules/no-rules.jpg`}
              alt={rule}
            />
            <Typography.Paragraph className={clsx(styles.rulesCarousel__ruleText, ruleClassName)}>
              {rule}
            </Typography.Paragraph>
          </div>
        ))}
      </Carousel>
      <SpaceContainer className={actionsClassName}>
        <Button
          type="default"
          ghost
          onClick={() => ref.current?.prev()}
          size="small"
        >
          <DoubleLeftOutlined />{' '}
          <Translate
            pt="Regra Anterior"
            en="Previous Rule"
          />
        </Button>
        <Button
          type="default"
          ghost
          onClick={() => ref.current?.next()}
          size="small"
        >
          <Translate
            pt="Próxima Regra"
            en="Next Rule"
          />{' '}
          <DoubleRightOutlined />
        </Button>
      </SpaceContainer>
    </div>
  );
}
