import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Card from './Card';

const getBracketClass = (number, showNeedle, needle, showTarget, target) => {
  const baseBracketClass = 'o-dial-numbers';
  const modifier = number % 2 === 0 ? 'even' : 'odd';
  return clsx(
    baseBracketClass,
    `${baseBracketClass}--${modifier}`,
    showNeedle && needle === number && `${baseBracketClass}--active`,
    showTarget && target === number && `${baseBracketClass}--target`
  );
};

function Dial({
  card,
  needle = 0,
  showNeedle = false,
  target = 0,
  showTarget = false,
  rivalGuess = 0,
  rivalTeam = 'rival',
  animate = false,
  showPoints,
  setNeedle,
}) {
  const baseClass = 'o-dial';
  const basePointsClass = 'o-dial-points';
  const baseRivalClass = 'o-dial-rival';
  const points = Math.abs(needle - target);

  return (
    <div
      className={clsx(
        `${baseClass}`,
        animate && `${baseClass}--animated`,
        Boolean(setNeedle) && `${baseClass}--clickable`
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 670 340"
        overflow="visible"
        className={clsx(`${baseClass}__svg`)}
      >
        <defs />

        <path
          d="M669.9 329.9c-1.1-21-6.1-71.9-27.3-127.7C591.2 83.3 472.8 0 335 0h-.2C198.2.1 80.7 81.9 28.7 199.2 5.7 258 1 312.1 0 332c-.1 1.1.1 2.1.5 3 1.1 2.9 3.9 5 7.2 5h654.6c3.3 0 6.1-2.1 7.2-5 .2-.5.3-1.1.4-1.7v-3.4z"
          fill="#181d44"
        />

        {showTarget && (
          <path
            id="target"
            className={clsx(`${baseClass}__target`, animate && `${basePointsClass}--animated-2`)}
            style={{ transform: `rotate(${target * 8}deg)` }}
            d="M335.2 0l7.1 11.4 13 3.2-8.6 10.3.9 13.4-12.4-5.1-12.5 5.1 1-13.4-8.6-10.3 13-3.2z"
          />
        )}

        <g className="o-dial-numbers">
          <path
            id="bracket-number-10-r"
            className={getBracketClass(10, showNeedle, needle, showTarget, target)}
            d="M341.2 51.9l-3 5.4v-5.1c0-.4.1-.8.4-1.1.3-.3.6-.4 1.1-.4.8 0 1.3.4 1.5 1.2zm-2.5 9c.2.2.6.3 1 .3s.8-.1 1.1-.5c.3-.3.4-.7.4-1.1v-5.1l-3 5.3c.1.6.2.9.5 1.1zm16.8-20.2L335 340 314.5 40.7h41zm-23.8 8.5h-1.5l-3 1.5v1.5h1.5v10.5h3V49.2zm12.5 10.5v-7.5c0-.8-.3-1.5-.9-2.1-.6-.6-1.3-.9-2.1-.9h-3c-.8 0-1.5.3-2.1.9-.6.6-.9 1.3-.9 2.1v7.5c0 .8.3 1.5.9 2.1.6.6 1.3.9 2.1.9h3c.8 0 1.5-.3 2.1-.9.6-.6.9-1.3.9-2.1z"
            onClick={() => setNeedle(10)}
          />
          <path
            id="bracket-number-9-r"
            className={getBracketClass(9, showNeedle, needle, showTarget, target)}
            d="M336 51.1c.3.3.4.7.4 1.1v3c0 .4-.1.8-.4 1.1-.3.3-.7.5-1.1.5-.4 0-.8-.1-1.1-.5-.3-.3-.4-.7-.4-1.1v-3c0-.4.1-.8.4-1.1s.6-.5 1.1-.5c.5.1.8.2 1.1.5zm19.5-10.4L335 340 314.5 40.7h41zm-16.1 16.7v-5.2c0-.8-.3-1.5-.9-2.1-.6-.6-1.3-.9-2.1-.9h-3c-.8 0-1.5.3-2.1.9-.6.6-.9 1.3-.9 2.1v3c0 .8.3 1.5.9 2.1.6.6 1.3.9 2.1.9h1.5c.9 0 1.4-.5 1.5-1.5v1.5c0 .8-.3 1.5-.9 2.1s-1.3.9-2.1.9h-1.5v1.5h2.2c1.4 0 2.7-.5 3.7-1.5s1.6-2.3 1.6-3.8z"
            onClick={() => setNeedle(9)}
          />
          <path
            id="bracket-number-8-r"
            className={getBracketClass(8, showNeedle, needle, showTarget, target)}
            d="M336.4 58.2v1.5c0 .4-.1.8-.4 1.1s-.7.4-1.1.4c-.4 0-.8-.1-1.1-.4s-.4-.7-.4-1.1v-1.5c0-1 .5-1.5 1.5-1.5s1.5.5 1.5 1.5zm-1.5-7.5c-.4 0-.8.1-1.1.4-.3.3-.4.7-.4 1.1v1.5c0 .4.1.8.4 1.1.3.3.6.4 1.1.4.4 0 .8-.1 1.1-.4.3-.3.4-.6.4-1.1v-1.5c0-.4-.1-.8-.4-1.1-.3-.3-.6-.4-1.1-.4zm20.6-10L335 340 314.5 40.7h41zm-19.1 15.2c1-.1 1.7-.4 2.2-.9.5-.5.7-1.2.7-2.1v-.7c0-.8-.3-1.5-.9-2.1-.6-.6-1.3-.9-2.1-.9h-3c-.8 0-1.5.3-2.1.9-.6.6-.9 1.3-.9 2.1v.7c0 .9.3 1.6.8 2.1s1.3.8 2.2.9c-1 0-1.7.3-2.2 1-.5.6-.8 1.3-.8 2v.7c0 .7.3 1.3.9 2 .6.7 1.3 1 2.1 1h3c.8 0 1.5-.3 2.1-1 .6-.7.9-1.3.9-2V59c0-.7-.2-1.4-.7-2-.4-.7-1.2-1.1-2.2-1.1z"
            onClick={() => setNeedle(8)}
          />
          <path
            id="bracket-number-7-r"
            className={getBracketClass(7, showNeedle, needle, showTarget, target)}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm24.2 13l-.8 1.5c-1 2.1-1.5 3.6-1.5 4.5v3h-3v-3c0-1 .5-2.5 1.5-4.5l1.5-3v-1.5h-6v-1.5h9v3l-.7 1.5z"
            onClick={() => setNeedle(7)}
          />

          <path
            id="bracket-number-6-r"
            className={getBracketClass(6, showNeedle, needle, showTarget, target)}
            d="M336 55.6c.3.3.4.7.4 1.1v3c0 .4-.1.8-.4 1.1-.3.3-.7.5-1.1.5-.4 0-.8-.1-1.1-.5-.3-.3-.4-.7-.4-1.1v-3c0-.4.1-.8.4-1.1.3-.3.6-.4 1.1-.4.5 0 .8.1 1.1.4zm19.5-14.9L335 340 314.5 40.7h41zm-16.1 19v-3c0-.8-.3-1.5-.9-2.1s-1.3-.9-2.1-.9h-1.5c-.4 0-.8.1-1 .4-.3.3-.4.6-.5 1.1v-1.5c0-.8.3-1.5.9-2.1s1.3-.9 2.1-.9h1.5v-1.5h-2.2c-1.4 0-2.7.5-3.7 1.5s-1.6 2.3-1.6 3.7v5.2c0 .8.3 1.5.9 2.1.6.6 1.3.9 2.1.9h3c.8 0 1.5-.3 2.1-.9.6-.5.9-1.2.9-2z"
            onClick={() => setNeedle(6)}
          />

          <path
            id="bracket-number-5-r"
            className={getBracketClass(5, showNeedle, needle, showTarget, target)}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm21.9 13c.8 0 1.5.3 2.1.9s.9 1.3.9 2.1v3c0 .8-.3 1.5-.9 2.1s-1.3.9-2.1.9h-3c-1.8 0-2.8-1-3-3h1.5c.1 1 .6 1.5 1.5 1.5h1.5c.4 0 .8-.1 1.1-.4s.4-.7.4-1.1v-3c0-.4-.1-.8-.4-1.1-.3-.3-.7-.4-1.1-.4h-4.5v-6h9v1.5h-6v3h3z"
            onClick={() => setNeedle(5)}
          />

          <path
            id="bracket-number-4-r"
            className={getBracketClass(4, showNeedle, needle, showTarget, target)}
            d="M330.4 56.7l4.5-5.6v5.6h-4.5zm25.1-16L335 340 314.5 40.7h41zm-16.1 17.5v-1.5h-1.5v-7.5h-3l-6 7.5v1.5h6v4.5h3v-4.5h1.5z"
            onClick={() => setNeedle(4)}
          />

          <path
            id="bracket-number-3-r"
            className={getBracketClass(3, showNeedle, needle, showTarget, target)}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm21.9 13c.9 0 1.6.3 2.1 1s.8 1.3.8 2v3c0 .8-.3 1.5-.9 2.1s-1.3.9-2.1.9h-3c-1.8 0-2.8-1-3-3h1.5c.1 1 .6 1.5 1.5 1.5h1.5c.4 0 .8-.1 1.1-.4s.4-.7.4-1.1v-3c0-.2-.1-.6-.4-.9s-.6-.6-1.1-.6h-3v-1.5l4.5-3h-6v-1.5h9v1.5l-4.5 3h1.6z"
            onClick={() => setNeedle(3)}
          />

          <path
            id="bracket-number-2-r"
            className={getBracketClass(2, showNeedle, needle, showTarget, target)}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm24.9 20.5v1.5h-9v-1.5c0-1 1-2.4 2.9-4l.2-.2c1.9-1.7 2.9-3 2.9-4v-.7c0-.4-.1-.8-.4-1.1-.3-.3-.7-.4-1.1-.4h-1.5c-.9 0-1.4.5-1.5 1.5h-1.5c.2-2 1.2-3 3-3h3c.8 0 1.5.3 2.1.9.6.6.9 1.3.9 2.1v.7c0 1-1 2.4-2.9 4l-.2.2c-1.9 1.7-2.9 3-2.9 3.9v.1h6z"
            onClick={() => setNeedle(2)}
          />
          <path
            id="bracket-number-1-r"
            className={getBracketClass(1, showNeedle, needle, showTarget, target)}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm18.9 22V52.2h-1.5v-1.5l3-1.5h1.5v13.5h-3z"
            onClick={() => setNeedle(1)}
          />

          <path
            id="bracket-number-10-l"
            className={getBracketClass(-10, showNeedle, needle, showTarget, target)}
            d="M341.2 51.9l-3 5.4v-5.1c0-.4.1-.8.4-1.1.3-.3.6-.4 1.1-.4.8 0 1.3.4 1.5 1.2zm-2.5 9c.2.2.6.3 1 .3s.8-.1 1.1-.5c.3-.3.4-.7.4-1.1v-5.1l-3 5.3c.1.6.2.9.5 1.1zm16.8-20.2L335 340 314.5 40.7h41zm-23.8 8.5h-1.5l-3 1.5v1.5h1.5v10.5h3V49.2zm12.5 10.5v-7.5c0-.8-.3-1.5-.9-2.1-.6-.6-1.3-.9-2.1-.9h-3c-.8 0-1.5.3-2.1.9-.6.6-.9 1.3-.9 2.1v7.5c0 .8.3 1.5.9 2.1.6.6 1.3.9 2.1.9h3c.8 0 1.5-.3 2.1-.9.6-.6.9-1.3.9-2.1z"
            onClick={() => setNeedle(-10)}
          />
          <path
            id="bracket-number-9-l"
            className={getBracketClass(-9, showNeedle, needle, showTarget, target)}
            d="M336 51.1c.3.3.4.7.4 1.1v3c0 .4-.1.8-.4 1.1-.3.3-.7.5-1.1.5-.4 0-.8-.1-1.1-.5-.3-.3-.4-.7-.4-1.1v-3c0-.4.1-.8.4-1.1s.6-.5 1.1-.5c.5.1.8.2 1.1.5zm19.5-10.4L335 340 314.5 40.7h41zm-16.1 16.7v-5.2c0-.8-.3-1.5-.9-2.1-.6-.6-1.3-.9-2.1-.9h-3c-.8 0-1.5.3-2.1.9-.6.6-.9 1.3-.9 2.1v3c0 .8.3 1.5.9 2.1.6.6 1.3.9 2.1.9h1.5c.9 0 1.4-.5 1.5-1.5v1.5c0 .8-.3 1.5-.9 2.1s-1.3.9-2.1.9h-1.5v1.5h2.2c1.4 0 2.7-.5 3.7-1.5s1.6-2.3 1.6-3.8z"
            onClick={() => setNeedle(-9)}
          />
          <path
            id="bracket-number-8-l"
            className={getBracketClass(-8, showNeedle, needle, showTarget, target)}
            d="M336.4 58.2v1.5c0 .4-.1.8-.4 1.1s-.7.4-1.1.4c-.4 0-.8-.1-1.1-.4s-.4-.7-.4-1.1v-1.5c0-1 .5-1.5 1.5-1.5s1.5.5 1.5 1.5zm-1.5-7.5c-.4 0-.8.1-1.1.4-.3.3-.4.7-.4 1.1v1.5c0 .4.1.8.4 1.1.3.3.6.4 1.1.4.4 0 .8-.1 1.1-.4.3-.3.4-.6.4-1.1v-1.5c0-.4-.1-.8-.4-1.1-.3-.3-.6-.4-1.1-.4zm20.6-10L335 340 314.5 40.7h41zm-19.1 15.2c1-.1 1.7-.4 2.2-.9.5-.5.7-1.2.7-2.1v-.7c0-.8-.3-1.5-.9-2.1-.6-.6-1.3-.9-2.1-.9h-3c-.8 0-1.5.3-2.1.9-.6.6-.9 1.3-.9 2.1v.7c0 .9.3 1.6.8 2.1s1.3.8 2.2.9c-1 0-1.7.3-2.2 1-.5.6-.8 1.3-.8 2v.7c0 .7.3 1.3.9 2 .6.7 1.3 1 2.1 1h3c.8 0 1.5-.3 2.1-1 .6-.7.9-1.3.9-2V59c0-.7-.2-1.4-.7-2-.4-.7-1.2-1.1-2.2-1.1z"
            onClick={() => setNeedle(-8)}
          />
          <path
            id="bracket-number-7-l"
            className={getBracketClass(-7, showNeedle, needle, showTarget, target)}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm24.2 13l-.8 1.5c-1 2.1-1.5 3.6-1.5 4.5v3h-3v-3c0-1 .5-2.5 1.5-4.5l1.5-3v-1.5h-6v-1.5h9v3l-.7 1.5z"
            onClick={() => setNeedle(-7)}
          />
          <path
            id="bracket-number-6-l"
            className={getBracketClass(-6, showNeedle, needle, showTarget, target)}
            d="M336 55.6c.3.3.4.7.4 1.1v3c0 .4-.1.8-.4 1.1-.3.3-.7.5-1.1.5-.4 0-.8-.1-1.1-.5-.3-.3-.4-.7-.4-1.1v-3c0-.4.1-.8.4-1.1.3-.3.6-.4 1.1-.4.5 0 .8.1 1.1.4zm19.5-14.9L335 340 314.5 40.7h41zm-16.1 19v-3c0-.8-.3-1.5-.9-2.1s-1.3-.9-2.1-.9h-1.5c-.4 0-.8.1-1 .4-.3.3-.4.6-.5 1.1v-1.5c0-.8.3-1.5.9-2.1s1.3-.9 2.1-.9h1.5v-1.5h-2.2c-1.4 0-2.7.5-3.7 1.5s-1.6 2.3-1.6 3.7v5.2c0 .8.3 1.5.9 2.1.6.6 1.3.9 2.1.9h3c.8 0 1.5-.3 2.1-.9.6-.5.9-1.2.9-2z"
            onClick={() => setNeedle(-6)}
          />
          <path
            id="bracket-number-5-l"
            className={getBracketClass(-5, showNeedle, needle, showTarget, target)}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm21.9 13c.8 0 1.5.3 2.1.9s.9 1.3.9 2.1v3c0 .8-.3 1.5-.9 2.1s-1.3.9-2.1.9h-3c-1.8 0-2.8-1-3-3h1.5c.1 1 .6 1.5 1.5 1.5h1.5c.4 0 .8-.1 1.1-.4s.4-.7.4-1.1v-3c0-.4-.1-.8-.4-1.1-.3-.3-.7-.4-1.1-.4h-4.5v-6h9v1.5h-6v3h3z"
            onClick={() => setNeedle(-5)}
          />
          <path
            id="bracket-number-4-l"
            className={getBracketClass(-4, showNeedle, needle, showTarget, target)}
            d="M330.4 56.7l4.5-5.6v5.6h-4.5zm25.1-16L335 340 314.5 40.7h41zm-16.1 17.5v-1.5h-1.5v-7.5h-3l-6 7.5v1.5h6v4.5h3v-4.5h1.5z"
            onClick={() => setNeedle(-4)}
          />
          <path
            id="bracket-number-3-l"
            className={getBracketClass(-3, showNeedle, needle, showTarget, target)}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm21.9 13c.9 0 1.6.3 2.1 1s.8 1.3.8 2v3c0 .8-.3 1.5-.9 2.1s-1.3.9-2.1.9h-3c-1.8 0-2.8-1-3-3h1.5c.1 1 .6 1.5 1.5 1.5h1.5c.4 0 .8-.1 1.1-.4s.4-.7.4-1.1v-3c0-.2-.1-.6-.4-.9s-.6-.6-1.1-.6h-3v-1.5l4.5-3h-6v-1.5h9v1.5l-4.5 3h1.6z"
            onClick={() => setNeedle(-3)}
          />
          <path
            id="bracket-number-2-l"
            className={getBracketClass(-2, showNeedle, needle, showTarget, target)}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm24.9 20.5v1.5h-9v-1.5c0-1 1-2.4 2.9-4l.2-.2c1.9-1.7 2.9-3 2.9-4v-.7c0-.4-.1-.8-.4-1.1-.3-.3-.7-.4-1.1-.4h-1.5c-.9 0-1.4.5-1.5 1.5h-1.5c.2-2 1.2-3 3-3h3c.8 0 1.5.3 2.1.9.6.6.9 1.3.9 2.1v.7c0 1-1 2.4-2.9 4l-.2.2c-1.9 1.7-2.9 3-2.9 3.9v.1h6z"
            onClick={() => setNeedle(-2)}
          />
          <path
            id="bracket-number-1-l"
            className={getBracketClass(-1, showNeedle, needle, showTarget, target)}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm18.9 22V52.2h-1.5v-1.5l3-1.5h1.5v13.5h-3z"
            onClick={() => setNeedle(-1)}
          />

          <path
            id="bracket-number-0"
            className={getBracketClass(0, showNeedle, needle, showTarget, target)}
            d="M333.5 59.9l3-5.3v5.1c0 .4-.1.8-.4 1.1-.3.3-.7.5-1.1.5-.4 0-.7-.1-1-.3-.3-.3-.5-.6-.5-1.1zm1.4-9.2c-.4 0-.8.1-1.1.4-.3.3-.4.7-.4 1.1v5.1l3-5.4c-.2-.8-.7-1.2-1.5-1.2zm20.6-10L335 340 314.5 40.7h41zm-16.1 19v-7.5c0-.8-.3-1.5-.9-2.1-.6-.6-1.3-.9-2.1-.9h-3c-.8 0-1.5.3-2.1.9-.6.6-.9 1.3-.9 2.1v7.5c0 .8.3 1.5.9 2.1.6.6 1.3.9 2.1.9h3c.8 0 1.5-.3 2.1-.9.6-.6.9-1.3.9-2.1z"
            onClick={() => setNeedle(0)}
          />
        </g>

        {showNeedle && (
          <path
            id="needle"
            className={clsx(`${baseClass}__needle`, animate && `${basePointsClass}--animated-1`)}
            style={{ transform: `rotate(${needle * 8}deg)` }}
            d="M335 340c-.9 0-3.7-.8-3.7-1.8l2-260.6c0-1 .8-1.8 1.7-1.8.9 0 1.7.8 1.7 1.8l2 260.6c0 1-2.8 1.8-3.7 1.8z"
          />
        )}

        {showPoints && (
          <g className={clsx(`${baseClass}__points`)}>
            {points === 0 && (
              <g>
                <path
                  fill="#29abe2"
                  d="M335.2 102.7l14 22.5 25.8 6.4-17.1 20.3 1.9 26.5-24.6-10-24.6 10 1.9-26.5-17.1-20.3 25.7-6.4z"
                />
                <path
                  d="M334.9 158.7v-10.1h-13.5v-3.4l13.5-16.9h6.8v16.9h3.4v3.4h-3.4v10.1h-6.8zm0-13.4v-12.7l-10.1 12.7h10.1z"
                  fill="#fff"
                />
              </g>
            )}

            {points === 1 && (
              <g>
                <path
                  fill="#a45467"
                  d="M335.2 102.7l14 22.5 25.8 6.4-17.1 20.3 1.9 26.5-24.6-10-24.6 10 1.9-26.5-17.1-20.3 25.7-6.4z"
                />
                <path
                  d="M324.8 130.4H345v3.4l-10.1 6.8h3.4c1.9 0 3.6.7 4.8 2.2 1.3 1.5 1.9 3 1.9 4.5v6.7c0 1.9-.7 3.5-2 4.8-1.3 1.3-2.9 2-4.7 2h-6.8c-4 0-6.2-2.3-6.8-6.8h3.4c.2 2.3 1.3 3.4 3.4 3.4h3.4c.9 0 1.7-.3 2.4-1s1-1.5 1-2.4v-6.7c0-.5-.3-1.2-.9-2.1-.6-.9-1.4-1.3-2.6-1.3h-6.7v-3.4l10.1-6.8h-13.5v-3.3z"
                  fill="#fff"
                />
              </g>
            )}

            {points === 2 && (
              <g className={clsx(`${baseClass}__points`)}>
                <path
                  fill="#a45467"
                  d="M335.2 102.7l14 22.5 25.8 6.4-17.1 20.3 1.9 26.5-24.6-10-24.6 10 1.9-26.5-17.1-20.3 25.7-6.4z"
                />
                <path
                  d="M328.2 136.1h-3.4c.5-4.5 2.8-6.8 6.8-6.8h6.8c1.8 0 3.4.7 4.7 2 1.3 1.3 2 2.9 2 4.8v1.7c0 2.3-2.2 5.4-6.5 9.1l-.4.4c-4.3 3.7-6.5 6.7-6.5 8.8v.3H345v3.4h-20.3v-3.4c0-2.4 2.2-5.4 6.6-9.1l.4-.4c4.3-3.7 6.5-6.8 6.5-9.1v-1.7c0-.9-.3-1.7-1-2.4s-1.5-1-2.4-1h-3.4c-1.9 0-3.1 1.2-3.2 3.4z"
                  fill="#fff"
                />
              </g>
            )}
          </g>
        )}

        {rivalGuess === -1 && (
          <g className={clsx(`${baseRivalClass} ${baseRivalClass}---1`)}>
            <path
              fill="#FFFFFF"
              d="M64.6 14.1c-23.9 0-43.3 14.4-43.3 32.1 0 8.8 4.8 16.8 12.6 22.6-5.3 4.6-12.3 7-19.4 6.6 1.8 1.5 3.7 2.7 5.9 3.7 9 4 19.1 2.2 26.2-3.6 5.5 1.9 11.6 2.9 18 2.9 23.9 0 43.3-14.4 43.3-32.1S88.5 14.1 64.6 14.1z"
            />
            <path
              fill="#f7931e"
              d="M45.4 49.1c-2.3-1.3-2.3-4.6 0-5.9l13.1-7.6L71.6 28c2.3-1.3 5.1.3 5.1 2.9v30.2c0 2.6-2.8 4.2-5.1 2.9l-13.1-7.6-13.1-7.3z"
            />
            <text x="10" y="11" fill="#FFFFFF" style={{ textAnchor: 'start' }}>
              O time {rivalTeam} disse que tá mais pra cá!
            </text>
          </g>
        )}

        {rivalGuess === 1 && (
          <g className={clsx(`${baseRivalClass} ${baseRivalClass}---1`)}>
            <text x="660" y="11" fill="#FFFFFF" style={{ textAnchor: 'end' }}>
              O time {rivalTeam} disse que tá mais pra cá!
            </text>
            <path
              fill="#FFFFFF"
              d="M605.4 14.1c23.9 0 43.3 14.4 43.3 32.1 0 8.8-4.8 16.8-12.6 22.6 5.3 4.6 12.3 7 19.4 6.6-1.8 1.5-3.7 2.7-5.9 3.7-9 4-19.1 2.2-26.2-3.6-5.5 1.9-11.6 2.9-18 2.9-23.9 0-43.3-14.4-43.3-32.1s19.4-32.2 43.3-32.2z"
            />
            <path
              fill="#f7931e"
              d="M624.6 49.1c2.3-1.3 2.3-4.6 0-5.9l-13.1-7.6-13.1-7.6c-2.3-1.3-5.1.3-5.1 2.9v30.2c0 2.6 2.8 4.2 5.1 2.9l13.1-7.6 13.1-7.3z"
            />
          </g>
        )}
      </svg>
      <Card left={card.left} right={card.right} className="o-dial__card" setNeedle={setNeedle} />
    </div>
  );
}

Dial.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string,
    left: PropTypes.string,
    right: PropTypes.string,
  }).isRequired,
  needle: PropTypes.number,
  showNeedle: PropTypes.bool,
  target: PropTypes.number,
  showTarget: PropTypes.bool,
  showPoints: PropTypes.bool,
  rivalGuess: PropTypes.number,
  rivalTeam: PropTypes.string,
  animate: PropTypes.bool,
};

Dial.defaultProps = {
  needle: 0,
  showNeedle: false,
  target: 0,
  showTarget: false,
  showPoints: false,
  rivalGuess: 0,
  rivalTeam: 'rival',
  animate: false,
};

export default memo(Dial);
