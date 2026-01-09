import clsx from 'clsx';
import { type ReactNode, useState } from 'react';
// Ant Design Resources
import { StarFilled } from '@ant-design/icons';
import { Alert, Button, Input, Rate } from 'antd';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useGameMeta } from 'hooks/useGameMeta';
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Services
import { GAME_API_COMMON_ACTIONS } from 'services/adapters';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { FixedMenuButton } from 'components/buttons';
import { Translate } from 'components/language';
// Adapters

const { TextArea } = Input;

type RateGameWidgetProps = {
  customText?: ReactNode;
};

export function RateGameWidget({ customText }: RateGameWidgetProps) {
  const [hideWidget, setHideWidget] = useState(false);

  if (hideWidget) {
    return null;
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
      open
    />
  );
}

type RateGameWidgetContentProps = {
  hideWidget: boolean;
  setHideWidget: React.Dispatch<React.SetStateAction<boolean>>;
} & RateGameWidgetProps;

function RateGameWidgetContent({ customText, hideWidget, setHideWidget }: RateGameWidgetContentProps) {
  const {
    meta: { gameId },
  } = useGameMeta();
  const { isLoading } = useLoading();
  const { translate } = useLanguage();
  const [userId] = useGlobalState('userId');
  const { isAdmin } = useCurrentUserContext();
  const [isAdminEnabled] = useGlobalState('isAdminEnabled');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');

  const [thankYouMessage, setThankYouMessage] = useState(false);

  const { start } = useCountdown({
    duration: 3,
    onExpire: () => setHideWidget(true),
    autoStart: false,
  });

  const onSendRating = useGameActionRequest({
    actionName: 'rating',
    successMessage: translate('Obrigado por avaliar o jogo', 'Thanks for rating the game'),
    errorMessage: translate('Envio de avaliação falhou', 'Rating submission has failed'),
    onBeforeCall: () => setThankYouMessage(true),
    onAfterCall: start,
  });

  const onSubmit = () => {
    onSendRating({
      action: GAME_API_COMMON_ACTIONS.RATE_GAME,
      ratings: {
        comments,
        gameId,
        playerId: userId,
        ratedAt: Date.now(),
        rating,
      },
    });
  };

  if (isAdmin && !isAdminEnabled) return null;

  return (
    <div
      className={clsx(
        'rate-game-widget',
        thankYouMessage && 'rate-game-widget--thank-you',
        getAnimationClass(hideWidget ? 'bounceOut' : 'bounceIn'),
      )}
    >
      {thankYouMessage ? (
        <Alert
          title={translate('Obrigado', 'Thank you')}
          type="success"
          showIcon
        />
      ) : (
        <>
          <h3>
            <Translate
              pt="O que achou do jogo?"
              en="Rate this game"
            />
          </h3>
          <Rate onChange={setRating} />
          <p>
            <Translate
              pt="Comentários"
              en="Comments"
              custom={customText}
            />
          </p>
          <TextArea
            onChange={(e) => setComments(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="primary"
            disabled={!rating || isLoading}
            onClick={onSubmit}
            size="small"
          >
            <Translate
              pt="Enviar"
              en="Send"
            />
          </Button>
          <p style={{ marginTop: '1rem' }}>
            <Button
              ghost
              onClick={() => setHideWidget(true)}
              size="small"
            >
              <Translate
                pt="Hide"
                en="Hide"
              />
            </Button>
          </p>
        </>
      )}
    </div>
  );
}
