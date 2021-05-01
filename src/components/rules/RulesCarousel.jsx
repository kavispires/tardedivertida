import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Typography, Image, Carousel } from 'antd';
// Constants
import { PUBLIC_URL } from '../../utils/constants';

function RulesCarousel({ game, className, ruleClass }) {
  return (
    <Carousel className={clsx('rules-carousel', className)} autoplay autoplaySpeed={10000}>
      {game.rules.map((rule, index) => (
        <div className={clsx('rules-carousel__rule', ruleClass)} key={rule}>
          <Image
            className="rules-carousel__image"
            src={`${PUBLIC_URL.RULES}${game.image}-${index}.jpg`}
            fallback={`${PUBLIC_URL.RULES}game-rule-not-found.jpg`}
            alt={rule}
            // preview={false}
          />
          <Typography.Paragraph className="rules-carousel__rule-text">{rule}</Typography.Paragraph>
        </div>
      ))}
    </Carousel>
  );
}

RulesCarousel.propTypes = {
  game: PropTypes.shape({
    image: PropTypes.string,
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
