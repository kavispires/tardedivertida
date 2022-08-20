import clsx from 'clsx';
// Ant Design Resources
import { Typography, Image, Carousel, Button } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Constants
import { PUBLIC_URL } from 'utils/constants';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';

type RulesCarouselProps = {
  info: GameInfo;
  /**
   * Optional custom class name
   */
  className?: string;
  ruleClass?: string;
};

export function RulesCarousel({ info, className = '', ruleClass = '' }: RulesCarouselProps): JSX.Element {
  const { language } = useLanguage();
  const settings = {
    prevArrow: (
      <Button>
        <DoubleLeftOutlined className="rules-carousel__nav rules-carousel__nav--left" />
      </Button>
    ),
    nextArrow: (
      <Button>
        <DoubleRightOutlined className="rules-carousel__nav rules-carousel__nav--right" />
      </Button>
    ),
  };

  return (
    <Carousel
      className={clsx('rules-carousel', className)}
      autoplay
      autoplaySpeed={15000}
      arrows
      {...settings}
    >
      {info.rules[language].map((rule, index) => (
        <div className={clsx('rules-carousel__rule', ruleClass)} key={rule}>
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
          <Typography.Paragraph className="rules-carousel__rule-text">{rule}</Typography.Paragraph>
        </div>
      ))}
    </Carousel>
  );
}
