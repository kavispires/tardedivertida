import clsx from 'clsx';
import { getColorModifier } from 'games/onda-telepatica/utils/helpers';
import { useState } from 'react';
// Ant Design Resources
import { ArrowLeftOutlined, ArrowRightOutlined, MinusOutlined } from '@ant-design/icons';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction, TextHighlight } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackOndaTelepatica = ({ track, round, onSubmitAnswer, user, players }: TrackProps) => {
  const { isLoading } = useLoading();
  const [position, setPosition] = useState(0);

  const onSelect = (value: string) => {
    if (!isLoading && !user.ready) {
      onSubmitAnswer({
        data: { value },
      });
    }
  };

  // // DEV Mock
  useMock(() => {
    onSelect(mockSelection(['left', 'center', 'right']));
  });

  const cardSideClass = 'o-card__side';

  return (
    <>
      <MinigameTitle title={{ pt: 'Onda Telepática', en: 'Telepathic Waves' }} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Com a carta de as duas ideias opostas e a dica abaixo, você acha que o Medidor de Ondas
              Telepáticas apontaria para a <TextHighlight>Esquerda</TextHighlight>,{' '}
              <TextHighlight>Centro</TextHighlight> ou <TextHighlight>Direita</TextHighlight>?
            </>
          }
          en={
            <>
              With the card of the two opposing ideas and the clue below, do you think the Wavelength
              Measuring device would point to the <TextHighlight>Left</TextHighlight>,{' '}
              <TextHighlight>Center</TextHighlight>, or <TextHighlight>Right</TextHighlight>?
            </>
          }
        />
      </Instruction>

      <Card>{track.data.option.value}</Card>

      <div className="o-simple-dial">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 669.93 340" width="40vw">
          <path
            fill="#181d44"
            d="M669.88 329.88a440.53 440.53 0 00-27.31-127.68C591.16 83.26 472.81 0 335 0h-.22C198.2.07 80.75 81.88 28.66 199.16A439.25 439.25 0 000 332a7.67 7.67 0 007.68 8h654.63a7.7 7.7 0 007.21-5 7.78 7.78 0 00.41-1.68l-.05-3.44z"
          ></path>
          <path
            fill="#b8b2a6"
            d="M119.67 121.48a303.5 303.5 0 00-61.93 91.22 401 401 0 00-25.59 120 7 7 0 00.43 2.75A6.86 6.86 0 0039 340h295.86L181.06 73.61a300.5 300.5 0 00-61.39 47.87z"
            className="o-simple-dial__clickable"
            onClick={() => onSelect('left')}
            onMouseEnter={() => setPosition(-1)}
          ></path>

          <path
            fill="#c2acc7"
            d="M630.39 330.85A402.06 402.06 0 00606 215.46 302.44 302.44 0 00487.05 77L335.19 340h288.44a6.88 6.88 0 006.44-4.52 7.56 7.56 0 00.36-1.51c0-1.04-.02-2.08-.04-3.12z"
            className="o-simple-dial__clickable"
            onClick={() => onSelect('right')}
            onMouseEnter={() => setPosition(1)}
          ></path>
          <path
            fill="#96a6a8"
            d="M331.32 32.7h-.2a295 295 0 00-150.06 40.91L334.86 340h.33L487.05 77a295 295 0 00-155.73-44.3z"
            className="o-simple-dial__clickable"
            onClick={() => onSelect('center')}
            onMouseEnter={() => setPosition(0)}
          ></path>

          <path
            fill="#ff0004"
            d="M336.46 24.24a1.5 1.5 0 0 0-3 0L326.65 340a1.48 1.48 0 0 0 .45 1.1l6.81 6.73a1.51 1.51 0 0 0 2.11 0l6.81-6.73a1.48 1.48 0 0 0 .45-1.1Z"
            className={clsx('o-simple-dial__pointer', `o-simple-dial__pointer--p${position}`)}
          ></path>
        </svg>
      </div>

      <div className={clsx('o-card')}>
        <div
          className={clsx(
            cardSideClass,
            `${cardSideClass}--left`,
            `${cardSideClass}--L${getColorModifier(track.data.card.left)}`
          )}
        >
          <span className="o-card__arrow">
            <ArrowLeftOutlined /> <MinusOutlined /> <MinusOutlined />
          </span>
          <span className="o-card__text">{track.data.card.left}</span>
        </div>
        <div
          className={clsx(
            cardSideClass,
            `${cardSideClass}--right`,
            `${cardSideClass}--R${getColorModifier(track.data.card.right)}`
          )}
        >
          <span className="o-card__arrow">
            <MinusOutlined /> <MinusOutlined /> <ArrowRightOutlined />
          </span>
          <span className="o-card__text">{track.data.card.right}</span>
        </div>
      </div>
    </>
  );
};

export function SimpleDial() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 669.93 340">
      <path
        fill="#181d44"
        d="M669.88 329.88a440.53 440.53 0 00-27.31-127.68C591.16 83.26 472.81 0 335 0h-.22C198.2.07 80.75 81.88 28.66 199.16A439.25 439.25 0 000 332a7.67 7.67 0 007.68 8h654.63a7.7 7.7 0 007.21-5 7.78 7.78 0 00.41-1.68l-.05-3.44z"
      ></path>
      <path
        fill="#b8b2a6"
        d="M119.67 121.48a303.5 303.5 0 00-61.93 91.22 401 401 0 00-25.59 120 7 7 0 00.43 2.75A6.86 6.86 0 0039 340h295.86L181.06 73.61a300.5 300.5 0 00-61.39 47.87z"
      ></path>
      <path
        fill="#96a6a8"
        d="M331.32 32.7h-.2a295 295 0 00-150.06 40.91L334.86 340h.33L487.05 77a295 295 0 00-155.73-44.3z"
      ></path>
      <path
        fill="#c2acc7"
        d="M630.39 330.85A402.06 402.06 0 00606 215.46 302.44 302.44 0 00487.05 77L335.19 340h288.44a6.88 6.88 0 006.44-4.52 7.56 7.56 0 00.36-1.51c0-1.04-.02-2.08-.04-3.12z"
      ></path>
    </svg>
  );
}
