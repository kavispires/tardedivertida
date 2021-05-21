import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Typography, Image, Carousel } from 'antd';
// Constants
import { PUBLIC_URL } from '../../utils/constants';

function RulesCarousel({ info, className, ruleClass }) {
  return (
    <Carousel className={clsx('rules-carousel', className)} autoplay autoplaySpeed={15000}>
      {info.rules.map((rule, index) => (
        <div className={clsx('rules-carousel__rule', ruleClass)} key={rule}>
          <Image
            className="rules-carousel__image"
            src={
              index === 0
                ? `${PUBLIC_URL.BANNERS}game-image-${info.gameName}.jpg`
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

RulesCarousel.propTypes = {
  info: PropTypes.shape({
    gameName: PropTypes.string,
    rules: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
  }),
  className: PropTypes.string,
  ruleClass: PropTypes.string,
};

RulesCarousel.defaultProps = {
  className: '',
  ruleClass: '',
};

export default RulesCarousel;
