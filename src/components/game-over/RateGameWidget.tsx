import { ReactNode, useState } from 'react';
import clsx from 'clsx';
// Ant Design Resources
import { Alert, Button, Input, Rate } from 'antd';
import { StarFilled } from '@ant-design/icons';
// Adapters
import { GAME_API } from 'services/adapters';
// Hooks
import { useAPICall } from 'hooks/useAPICall';
import { useCountdown } from 'hooks/useCountdown';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useGlobalState } from 'hooks/useGlobalState';
import { useGameMeta } from 'hooks/useGameMeta';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
import { FixedMenuButton } from 'components/buttons';

const { TextArea } = Input;

type RateGameWidgetProps = {
  customText?: ReactNode;
};

export function RateGameWidget({ customText }: RateGameWidgetProps) {
  const [hideWidget, setHideWidget] = useState(false);

  if (hideWidget) {
    return <></>;
  }

  return (
    <FixedMenuButton
      content={
        <RateGameWidgetContent
          customText={customText}
          hideWidget={hideWidget}
          setHideWidget={setHideWidget}
        />
      }
      type="popover"
      icon={<StarFilled />}
      position={3}
      open={true}
      buttonProps={{
        type: 'primary',
      }}
    />
  );
}

type RateGameWidgetContentProps = {
  hideWidget: boolean;
  setHideWidget: React.Dispatch<React.SetStateAction<boolean>>;
} & RateGameWidgetProps;

function RateGameWidgetContent({
  customText,
  hideWidget,
  setHideWidget,
}: RateGameWidgetContentProps): JSX.Element {
  const { gameId } = useGameMeta();
  const { isLoading } = useLoading();
  const { translate } = useLanguage();
  const [userId] = useGlobalState('userId');
  const [isAdmin] = useGlobalState('isAdmin');
  const [isAdminEnabled] = useGlobalState('isAdminEnabled');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');

  const [thankYouMessage, setThankYouMessage] = useState(false);

  const { start } = useCountdown({
    duration: 3,
    onExpire: () => setHideWidget(true),
    autoStart: false,
  });

  const onSendRating = useAPICall({
    apiFunction: GAME_API.rateGame,
    actionName: 'rating',
    successMessage: translate('Obrigado por avaliar o jogo', 'Thanks for rating the game'),
    errorMessage: translate('Envio de avaliação falhou', 'Rating submission has failed'),
    onBeforeCall: () => setThankYouMessage(true),
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

  if (isAdmin && !isAdminEnabled) return <></>;

  return (
    <div
      className={clsx(
        'rate-game-widget',
        thankYouMessage && 'rate-game-widget--thank-you',
        getAnimationClass(hideWidget ? 'bounceOut' : 'bounceIn')
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
            <Translate pt="Comentários" en="Comments" custom={customText} />
          </p>
          <TextArea onChange={(e) => setComments(e.target.value)} disabled={isLoading} />
          <Button type="primary" disabled={!rating || isLoading} onClick={onSubmit} size="small">
            <Translate pt="Enviar" en="Send" />
          </Button>
          <p style={{ marginTop: '1rem' }}>
            <Button type="ghost" ghost onClick={() => setHideWidget(true)} size="small">
              <Translate pt="Hide" en="Hide" />
            </Button>
          </p>
        </>
      )}
    </div>
  );
}
