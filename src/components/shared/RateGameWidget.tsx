import { useState } from 'react';
import clsx from 'clsx';
// Design Resources
import { Alert, Button, Rate } from 'antd';
import { Input } from 'antd';
// Adapters
import { GAME_API } from '../../adapters';
// Hooks
import { useTimer } from 'react-timer-hook';
import { useAPICall, useGlobalState, useLanguage, useLoading } from '../../hooks';
// Utils
import { inNSeconds } from '../../utils/helpers';
// Components
import { Translate } from '.';

const { TextArea } = Input;

export function RateGameWidget(): JSX.Element {
  const { isLoading } = useLoading();
  const { translate } = useLanguage();
  const [userId] = useGlobalState('userId');
  const [gameId] = useGlobalState('gameId');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [hideWidget, setHideWidget] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState(false);

  const { start } = useTimer({
    expiryTimestamp: inNSeconds(3),
    onExpire: () => setHideWidget(true),
    autoStart: false,
  });

  const onSendRating = useAPICall({
    apiFunction: GAME_API.rateGame,
    actionName: 'rating',
    successMessage: translate('Obrigado por avaliar o jogo', 'Thanks for rating the game'),
    errorMessage: translate('Envio de avaliação falhou', 'Rating submission has failed'),
    onSuccess: () => setThankYouMessage(true),
    onError: () => setThankYouMessage(true),
    onAfterCall: start,
  });

  const onSubmit = () => {
    onSendRating({
      ratings: {
        comments,
        gameId,
        playerId: userId,
        ratedAt: Date.now(),
        rating,
      },
    });
  };

  return (
    <div
      className={clsx(
        'rate-game-widget',
        thankYouMessage && 'rate-game-widget--thank-you',
        hideWidget ? 'swirl-out-bck' : 'swirl-in-fwd'
      )}
    >
      {thankYouMessage ? (
        <Alert message={translate('Obrigado', 'Thank you')} type="success" showIcon />
      ) : (
        <>
          <h3>
            <Translate pt="O que achou do jogo?" en="Rate this game" />
          </h3>
          <Rate onChange={setRating} />
          <p>
            <Translate pt="Comentários" en="Comments" />:
          </p>
          <TextArea onChange={(e) => setComments(e.target.value)} disabled={isLoading} />
          <Button type="primary" disabled={!rating || isLoading} onClick={onSubmit} size="small">
            <Translate pt="Enviar" en="Send" />
          </Button>
        </>
      )}
    </div>
  );
}
