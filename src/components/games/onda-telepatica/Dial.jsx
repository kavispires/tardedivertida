import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Card from './Card';

function Dial({
  card,
  needle = 0,
  showNeedle = false,
  target = 0,
  showTarget = false,
  rivalGuess = 0,
  animate = false,
}) {
  const baseClass = 'o-dial';
  const baseBracketClass = 'o-dial-numbers';
  const basePointsClass = 'o-dial-points';
  const baseRivalClass = 'o-dial-rival';

  return (
    <div className={clsx(`${baseClass}`, animate && `${baseClass}--animated`)}>
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

        {showNeedle && (
          <path
            id="needle"
            className={clsx(`${baseClass}__needle`)}
            style={{ transform: `rotate(${needle * 8}deg)` }}
            d="M335 35.2L316.1 2.6h37.8z"
          />
        )}

        <g class="o-dial-numbers">
          <path
            id="bracket-number-10-r"
            className={clsx(
              `${baseBracketClass}--odd`,
              showNeedle && needle === 10 && `${baseBracketClass}--active`
            )}
            d="M341.2 51.9l-3 5.4v-5.1c0-.4.1-.8.4-1.1.3-.3.6-.4 1.1-.4.8 0 1.3.4 1.5 1.2zm-2.5 9c.2.2.6.3 1 .3s.8-.1 1.1-.5c.3-.3.4-.7.4-1.1v-5.1l-3 5.3c.1.6.2.9.5 1.1zm16.8-20.2L335 340 314.5 40.7h41zm-23.8 8.5h-1.5l-3 1.5v1.5h1.5v10.5h3V49.2zm12.5 10.5v-7.5c0-.8-.3-1.5-.9-2.1-.6-.6-1.3-.9-2.1-.9h-3c-.8 0-1.5.3-2.1.9-.6.6-.9 1.3-.9 2.1v7.5c0 .8.3 1.5.9 2.1.6.6 1.3.9 2.1.9h3c.8 0 1.5-.3 2.1-.9.6-.6.9-1.3.9-2.1z"
          />
          <path
            id="bracket-number-9-r"
            className={clsx(
              `${baseBracketClass}--even`,
              showNeedle && needle === 9 && `${baseBracketClass}--active`
            )}
            d="M336 51.1c.3.3.4.7.4 1.1v3c0 .4-.1.8-.4 1.1-.3.3-.7.5-1.1.5-.4 0-.8-.1-1.1-.5-.3-.3-.4-.7-.4-1.1v-3c0-.4.1-.8.4-1.1s.6-.5 1.1-.5c.5.1.8.2 1.1.5zm19.5-10.4L335 340 314.5 40.7h41zm-16.1 16.7v-5.2c0-.8-.3-1.5-.9-2.1-.6-.6-1.3-.9-2.1-.9h-3c-.8 0-1.5.3-2.1.9-.6.6-.9 1.3-.9 2.1v3c0 .8.3 1.5.9 2.1.6.6 1.3.9 2.1.9h1.5c.9 0 1.4-.5 1.5-1.5v1.5c0 .8-.3 1.5-.9 2.1s-1.3.9-2.1.9h-1.5v1.5h2.2c1.4 0 2.7-.5 3.7-1.5s1.6-2.3 1.6-3.8z"
          />
          <path
            id="bracket-number-8-r"
            className={clsx(
              `${baseBracketClass}--odd`,
              showNeedle && needle === 8 && `${baseBracketClass}--active`
            )}
            d="M336.4 58.2v1.5c0 .4-.1.8-.4 1.1s-.7.4-1.1.4c-.4 0-.8-.1-1.1-.4s-.4-.7-.4-1.1v-1.5c0-1 .5-1.5 1.5-1.5s1.5.5 1.5 1.5zm-1.5-7.5c-.4 0-.8.1-1.1.4-.3.3-.4.7-.4 1.1v1.5c0 .4.1.8.4 1.1.3.3.6.4 1.1.4.4 0 .8-.1 1.1-.4.3-.3.4-.6.4-1.1v-1.5c0-.4-.1-.8-.4-1.1-.3-.3-.6-.4-1.1-.4zm20.6-10L335 340 314.5 40.7h41zm-19.1 15.2c1-.1 1.7-.4 2.2-.9.5-.5.7-1.2.7-2.1v-.7c0-.8-.3-1.5-.9-2.1-.6-.6-1.3-.9-2.1-.9h-3c-.8 0-1.5.3-2.1.9-.6.6-.9 1.3-.9 2.1v.7c0 .9.3 1.6.8 2.1s1.3.8 2.2.9c-1 0-1.7.3-2.2 1-.5.6-.8 1.3-.8 2v.7c0 .7.3 1.3.9 2 .6.7 1.3 1 2.1 1h3c.8 0 1.5-.3 2.1-1 .6-.7.9-1.3.9-2V59c0-.7-.2-1.4-.7-2-.4-.7-1.2-1.1-2.2-1.1z"
          />
          <path
            id="bracket-number-7-r"
            className={clsx(
              `${baseBracketClass}--even`,
              showNeedle && needle === 7 && `${baseBracketClass}--active`
            )}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm24.2 13l-.8 1.5c-1 2.1-1.5 3.6-1.5 4.5v3h-3v-3c0-1 .5-2.5 1.5-4.5l1.5-3v-1.5h-6v-1.5h9v3l-.7 1.5z"
          />

          <path
            id="bracket-number-6-r"
            className={clsx(
              `${baseBracketClass}--odd`,
              showNeedle && needle === 6 && `${baseBracketClass}--active`
            )}
            d="M336 55.6c.3.3.4.7.4 1.1v3c0 .4-.1.8-.4 1.1-.3.3-.7.5-1.1.5-.4 0-.8-.1-1.1-.5-.3-.3-.4-.7-.4-1.1v-3c0-.4.1-.8.4-1.1.3-.3.6-.4 1.1-.4.5 0 .8.1 1.1.4zm19.5-14.9L335 340 314.5 40.7h41zm-16.1 19v-3c0-.8-.3-1.5-.9-2.1s-1.3-.9-2.1-.9h-1.5c-.4 0-.8.1-1 .4-.3.3-.4.6-.5 1.1v-1.5c0-.8.3-1.5.9-2.1s1.3-.9 2.1-.9h1.5v-1.5h-2.2c-1.4 0-2.7.5-3.7 1.5s-1.6 2.3-1.6 3.7v5.2c0 .8.3 1.5.9 2.1.6.6 1.3.9 2.1.9h3c.8 0 1.5-.3 2.1-.9.6-.5.9-1.2.9-2z"
          />

          <path
            id="bracket-number-5-r"
            className={clsx(
              `${baseBracketClass}--even`,
              showNeedle && needle === 5 && `${baseBracketClass}--active`
            )}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm21.9 13c.8 0 1.5.3 2.1.9s.9 1.3.9 2.1v3c0 .8-.3 1.5-.9 2.1s-1.3.9-2.1.9h-3c-1.8 0-2.8-1-3-3h1.5c.1 1 .6 1.5 1.5 1.5h1.5c.4 0 .8-.1 1.1-.4s.4-.7.4-1.1v-3c0-.4-.1-.8-.4-1.1-.3-.3-.7-.4-1.1-.4h-4.5v-6h9v1.5h-6v3h3z"
          />

          <path
            id="bracket-number-4-r"
            className={clsx(
              `${baseBracketClass}--odd`,
              showNeedle && needle === 4 && `${baseBracketClass}--active`
            )}
            d="M330.4 56.7l4.5-5.6v5.6h-4.5zm25.1-16L335 340 314.5 40.7h41zm-16.1 17.5v-1.5h-1.5v-7.5h-3l-6 7.5v1.5h6v4.5h3v-4.5h1.5z"
          />

          <path
            id="bracket-number-3-r"
            className={clsx(
              `${baseBracketClass}--even`,
              showNeedle && needle === 3 && `${baseBracketClass}--active`
            )}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm21.9 13c.9 0 1.6.3 2.1 1s.8 1.3.8 2v3c0 .8-.3 1.5-.9 2.1s-1.3.9-2.1.9h-3c-1.8 0-2.8-1-3-3h1.5c.1 1 .6 1.5 1.5 1.5h1.5c.4 0 .8-.1 1.1-.4s.4-.7.4-1.1v-3c0-.2-.1-.6-.4-.9s-.6-.6-1.1-.6h-3v-1.5l4.5-3h-6v-1.5h9v1.5l-4.5 3h1.6z"
          />

          <path
            id="bracket-number-2-r"
            className={clsx(
              `${baseBracketClass}--odd`,
              showNeedle && needle === 2 && `${baseBracketClass}--active`
            )}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm24.9 20.5v1.5h-9v-1.5c0-1 1-2.4 2.9-4l.2-.2c1.9-1.7 2.9-3 2.9-4v-.7c0-.4-.1-.8-.4-1.1-.3-.3-.7-.4-1.1-.4h-1.5c-.9 0-1.4.5-1.5 1.5h-1.5c.2-2 1.2-3 3-3h3c.8 0 1.5.3 2.1.9.6.6.9 1.3.9 2.1v.7c0 1-1 2.4-2.9 4l-.2.2c-1.9 1.7-2.9 3-2.9 3.9v.1h6z"
          />
          <path
            id="bracket-number-1-r"
            className={clsx(
              `${baseBracketClass}--even`,
              showNeedle && needle === 1 && `${baseBracketClass}--active`
            )}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm18.9 22V52.2h-1.5v-1.5l3-1.5h1.5v13.5h-3z"
          />

          <path
            id="bracket-number-10-l"
            className={clsx(
              `${baseBracketClass}--odd`,
              showNeedle && needle === -10 && `${baseBracketClass}--active`
            )}
            d="M341.2 51.9l-3 5.4v-5.1c0-.4.1-.8.4-1.1.3-.3.6-.4 1.1-.4.8 0 1.3.4 1.5 1.2zm-2.5 9c.2.2.6.3 1 .3s.8-.1 1.1-.5c.3-.3.4-.7.4-1.1v-5.1l-3 5.3c.1.6.2.9.5 1.1zm16.8-20.2L335 340 314.5 40.7h41zm-23.8 8.5h-1.5l-3 1.5v1.5h1.5v10.5h3V49.2zm12.5 10.5v-7.5c0-.8-.3-1.5-.9-2.1-.6-.6-1.3-.9-2.1-.9h-3c-.8 0-1.5.3-2.1.9-.6.6-.9 1.3-.9 2.1v7.5c0 .8.3 1.5.9 2.1.6.6 1.3.9 2.1.9h3c.8 0 1.5-.3 2.1-.9.6-.6.9-1.3.9-2.1z"
          />
          <path
            id="bracket-number-9-l"
            className={clsx(
              `${baseBracketClass}--even`,
              showNeedle && needle === -9 && `${baseBracketClass}--active`
            )}
            d="M336 51.1c.3.3.4.7.4 1.1v3c0 .4-.1.8-.4 1.1-.3.3-.7.5-1.1.5-.4 0-.8-.1-1.1-.5-.3-.3-.4-.7-.4-1.1v-3c0-.4.1-.8.4-1.1s.6-.5 1.1-.5c.5.1.8.2 1.1.5zm19.5-10.4L335 340 314.5 40.7h41zm-16.1 16.7v-5.2c0-.8-.3-1.5-.9-2.1-.6-.6-1.3-.9-2.1-.9h-3c-.8 0-1.5.3-2.1.9-.6.6-.9 1.3-.9 2.1v3c0 .8.3 1.5.9 2.1.6.6 1.3.9 2.1.9h1.5c.9 0 1.4-.5 1.5-1.5v1.5c0 .8-.3 1.5-.9 2.1s-1.3.9-2.1.9h-1.5v1.5h2.2c1.4 0 2.7-.5 3.7-1.5s1.6-2.3 1.6-3.8z"
          />
          <path
            id="bracket-number-8-l"
            className={clsx(
              `${baseBracketClass}--odd`,
              showNeedle && needle === -8 && `${baseBracketClass}--active`
            )}
            d="M336.4 58.2v1.5c0 .4-.1.8-.4 1.1s-.7.4-1.1.4c-.4 0-.8-.1-1.1-.4s-.4-.7-.4-1.1v-1.5c0-1 .5-1.5 1.5-1.5s1.5.5 1.5 1.5zm-1.5-7.5c-.4 0-.8.1-1.1.4-.3.3-.4.7-.4 1.1v1.5c0 .4.1.8.4 1.1.3.3.6.4 1.1.4.4 0 .8-.1 1.1-.4.3-.3.4-.6.4-1.1v-1.5c0-.4-.1-.8-.4-1.1-.3-.3-.6-.4-1.1-.4zm20.6-10L335 340 314.5 40.7h41zm-19.1 15.2c1-.1 1.7-.4 2.2-.9.5-.5.7-1.2.7-2.1v-.7c0-.8-.3-1.5-.9-2.1-.6-.6-1.3-.9-2.1-.9h-3c-.8 0-1.5.3-2.1.9-.6.6-.9 1.3-.9 2.1v.7c0 .9.3 1.6.8 2.1s1.3.8 2.2.9c-1 0-1.7.3-2.2 1-.5.6-.8 1.3-.8 2v.7c0 .7.3 1.3.9 2 .6.7 1.3 1 2.1 1h3c.8 0 1.5-.3 2.1-1 .6-.7.9-1.3.9-2V59c0-.7-.2-1.4-.7-2-.4-.7-1.2-1.1-2.2-1.1z"
          />
          <path
            id="bracket-number-7-l"
            className={clsx(
              `${baseBracketClass}--even`,
              showNeedle && needle === -7 && `${baseBracketClass}--active`
            )}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm24.2 13l-.8 1.5c-1 2.1-1.5 3.6-1.5 4.5v3h-3v-3c0-1 .5-2.5 1.5-4.5l1.5-3v-1.5h-6v-1.5h9v3l-.7 1.5z"
          />
          <path
            id="bracket-number-6-l"
            className={clsx(
              `${baseBracketClass}--odd`,
              showNeedle && needle === -6 && `${baseBracketClass}--active`
            )}
            d="M336 55.6c.3.3.4.7.4 1.1v3c0 .4-.1.8-.4 1.1-.3.3-.7.5-1.1.5-.4 0-.8-.1-1.1-.5-.3-.3-.4-.7-.4-1.1v-3c0-.4.1-.8.4-1.1.3-.3.6-.4 1.1-.4.5 0 .8.1 1.1.4zm19.5-14.9L335 340 314.5 40.7h41zm-16.1 19v-3c0-.8-.3-1.5-.9-2.1s-1.3-.9-2.1-.9h-1.5c-.4 0-.8.1-1 .4-.3.3-.4.6-.5 1.1v-1.5c0-.8.3-1.5.9-2.1s1.3-.9 2.1-.9h1.5v-1.5h-2.2c-1.4 0-2.7.5-3.7 1.5s-1.6 2.3-1.6 3.7v5.2c0 .8.3 1.5.9 2.1.6.6 1.3.9 2.1.9h3c.8 0 1.5-.3 2.1-.9.6-.5.9-1.2.9-2z"
          />
          <path
            id="bracket-number-5-l"
            className={clsx(
              `${baseBracketClass}--even`,
              showNeedle && needle === -5 && `${baseBracketClass}--active`
            )}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm21.9 13c.8 0 1.5.3 2.1.9s.9 1.3.9 2.1v3c0 .8-.3 1.5-.9 2.1s-1.3.9-2.1.9h-3c-1.8 0-2.8-1-3-3h1.5c.1 1 .6 1.5 1.5 1.5h1.5c.4 0 .8-.1 1.1-.4s.4-.7.4-1.1v-3c0-.4-.1-.8-.4-1.1-.3-.3-.7-.4-1.1-.4h-4.5v-6h9v1.5h-6v3h3z"
          />
          <path
            id="bracket-number-4-l"
            className={clsx(
              `${baseBracketClass}--odd`,
              showNeedle && needle === -4 && `${baseBracketClass}--active`
            )}
            d="M330.4 56.7l4.5-5.6v5.6h-4.5zm25.1-16L335 340 314.5 40.7h41zm-16.1 17.5v-1.5h-1.5v-7.5h-3l-6 7.5v1.5h6v4.5h3v-4.5h1.5z"
          />
          <path
            id="bracket-number-3-l"
            className={clsx(
              `${baseBracketClass}--even`,
              showNeedle && needle === -3 && `${baseBracketClass}--active`
            )}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm21.9 13c.9 0 1.6.3 2.1 1s.8 1.3.8 2v3c0 .8-.3 1.5-.9 2.1s-1.3.9-2.1.9h-3c-1.8 0-2.8-1-3-3h1.5c.1 1 .6 1.5 1.5 1.5h1.5c.4 0 .8-.1 1.1-.4s.4-.7.4-1.1v-3c0-.2-.1-.6-.4-.9s-.6-.6-1.1-.6h-3v-1.5l4.5-3h-6v-1.5h9v1.5l-4.5 3h1.6z"
          />
          <path
            id="bracket-number-2-l"
            className={clsx(
              `${baseBracketClass}--odd`,
              showNeedle && needle === -2 && `${baseBracketClass}--active`
            )}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm24.9 20.5v1.5h-9v-1.5c0-1 1-2.4 2.9-4l.2-.2c1.9-1.7 2.9-3 2.9-4v-.7c0-.4-.1-.8-.4-1.1-.3-.3-.7-.4-1.1-.4h-1.5c-.9 0-1.4.5-1.5 1.5h-1.5c.2-2 1.2-3 3-3h3c.8 0 1.5.3 2.1.9.6.6.9 1.3.9 2.1v.7c0 1-1 2.4-2.9 4l-.2.2c-1.9 1.7-2.9 3-2.9 3.9v.1h6z"
          />
          <path
            id="bracket-number-1-l"
            className={clsx(
              `${baseBracketClass}--even`,
              showNeedle && needle === -1 && `${baseBracketClass}--active`
            )}
            d="M314.5 40.7L335 340l20.5-299.3h-41zm18.9 22V52.2h-1.5v-1.5l3-1.5h1.5v13.5h-3z"
          />

          <path
            id="bracket-number-0"
            className={clsx(
              `${baseBracketClass}--odd`,
              showNeedle && needle === 0 && `${baseBracketClass}--active`
            )}
            d="M333.5 59.9l3-5.3v5.1c0 .4-.1.8-.4 1.1-.3.3-.7.5-1.1.5-.4 0-.7-.1-1-.3-.3-.3-.5-.6-.5-1.1zm1.4-9.2c-.4 0-.8.1-1.1.4-.3.3-.4.7-.4 1.1v5.1l3-5.4c-.2-.8-.7-1.2-1.5-1.2zm20.6-10L335 340 314.5 40.7h41zm-16.1 19v-7.5c0-.8-.3-1.5-.9-2.1-.6-.6-1.3-.9-2.1-.9h-3c-.8 0-1.5.3-2.1.9-.6.6-.9 1.3-.9 2.1v7.5c0 .8.3 1.5.9 2.1.6.6 1.3.9 2.1.9h3c.8 0 1.5-.3 2.1-.9.6-.6.9-1.3.9-2.1z"
          />
        </g>

        {showTarget && (
          <g
            id="points"
            className={clsx(`${basePointsClass}`, animate && `${basePointsClass}--animated`)}
            style={{ transform: `rotate(${target * 8}deg)` }}
          >
            <g id="points-4-left">
              <path className={clsx(`${basePointsClass}__4`)} d="M314.5 40.7L335 340l20.5-299.3z" />
              <circle className={clsx(`${basePointsClass}__number`)} cx="334.9" cy="59.9" r="13.6" />
              <path
                className={clsx(`${basePointsClass}__4`)}
                d="M334.7 67.4v-4.5h-6v-1.5l6-7.5h3v7.5h1.5v1.5h-1.5v4.5h-3zm0-6v-5.6l-4.5 5.6h4.5z"
              />
            </g>
            {target > -10 && (
              <g>
                <path className={clsx(`${basePointsClass}__3`)} d="M274 46.3L335 340 314.5 40.7z" />
                <circle className={clsx(`${basePointsClass}__number`)} cx="297.2" cy="62.7" r="13.6" />
                <path
                  className={clsx(`${basePointsClass}__3`)}
                  d="M292 57l8.9-1.4.2 1.5-4 3.7 1.5-.2c.9-.1 1.6.1 2.3.6.7.6 1 1.2 1.1 1.9l.5 3c.1.8-.1 1.6-.5 2.2-.5.7-1.1 1.1-1.9 1.2l-3 .5c-1.7.3-2.9-.6-3.4-2.5l1.5-.2c.2 1 .8 1.4 1.7 1.3l1.5-.2c.4-.1.7-.3 1-.6.2-.3.3-.7.3-1.1l-.5-3c0-.2-.2-.5-.5-.9-.3-.3-.7-.5-1.2-.4l-3 .5-.2-1.5 4-3.7-5.9.9-.4-1.6z"
                />
              </g>
            )}
            {target > -9 && (
              <g>
                <path className={clsx(`${basePointsClass}__2`)} d="M234.5 57.3L335 340 274 46.3z" />
                <circle className={clsx(`${basePointsClass}__number`)} cx="260" cy="71" r="13.6" />
                <path
                  className={clsx(`${basePointsClass}__2`)}
                  d="M255.7 67.8l-1.5.4c-.3-2 .4-3.2 2.1-3.7l2.9-.8c.8-.2 1.5-.1 2.3.3.7.4 1.2 1 1.4 1.8l.2.7c.3 1-.3 2.6-1.7 4.7l-.1.2c-1.4 2.1-2 3.6-1.7 4.5v.1l5.8-1.6.4 1.4-8.7 2.4-.4-1.4c-.3-1 .3-2.6 1.7-4.7l.1-.2c1.4-2.1 2-3.7 1.7-4.7l-.2-.7c-.1-.4-.4-.7-.7-.9s-.7-.2-1.1-.1l-1.4.4c-.9.3-1.3.9-1.1 1.9z"
                />
              </g>
            )}
            {target < 10 && (
              <g>
                <path className={clsx(`${basePointsClass}__3`)} d="M355.5 40.7L335 340l61-293.7z" />
                <circle className={clsx(`${basePointsClass}__number`)} cx="374.1" cy="62.7" r="13.6" />
                <path
                  className={clsx(`${basePointsClass}__3`)}
                  d="M370.4 55.6l8.9 1.3-.2 1.5-4.9 2.3 1.5.2c.9.1 1.5.6 2 1.3.5.7.6 1.4.5 2.1l-.4 3c-.1.8-.5 1.5-1.2 2s-1.4.7-2.2.6l-3-.4c-1.7-.3-2.6-1.4-2.5-3.4l1.5.2c-.1 1 .3 1.6 1.3 1.7l1.5.2c.4.1.8 0 1.1-.3s.5-.6.6-1l.4-3c0-.2 0-.6-.2-1s-.5-.7-1-.7l-3-.4.2-1.5 4.9-2.3-6-.9.2-1.5z"
                />
              </g>
            )}
            {target < 9 && (
              <g>
                <path className={clsx(`${basePointsClass}__2`)} d="M396 46.3L335 340 435.5 57.3z" />
                <circle className={clsx(`${basePointsClass}__number`)} cx="410.4" cy="70.9" r="13.6" />
                <path
                  className={clsx(`${basePointsClass}__2`)}
                  d="M409.1 66.1l-1.4-.5c.8-1.8 2.1-2.5 3.8-2l2.9.9c.8.2 1.4.7 1.7 1.5.4.7.5 1.5.2 2.3l-.3.7c-.3 1-1.6 2-4 3l-.2.1c-2.3 1-3.6 2-3.9 2.9v.1l5.7 1.8-.4 1.4-8.6-2.7.4-1.4c.3-1 1.6-2 4-3l.2-.1c2.3-1 3.7-2 4-3l.2-.7c.1-.4.1-.8-.1-1.2-.2-.4-.5-.6-.9-.7l-1.4-.4c-1-.3-1.6 0-1.9 1z"
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
          </g>
        )}

        {rivalGuess === 1 && (
          <g className={clsx(`${baseRivalClass} ${baseRivalClass}---1`)}>
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
      <Card left={card.left} right={card.right} className="o-dial__card" />
    </div>
  );
}

Dial.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string,
    left: PropTypes.string,
    right: PropTypes.string,
  }).isRequired,
  needlePosition: PropTypes.number,
  showNeedle: PropTypes.bool,
  target: PropTypes.number,
  showTarget: PropTypes.bool,
  animate: PropTypes.bool,
  rivalGuess: PropTypes.number,
};

export default memo(Dial);
