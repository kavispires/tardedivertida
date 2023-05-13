import clsx from 'clsx';
import { ReactNode, useEffect } from 'react';
// Ant Design Resources
import { Tooltip } from 'antd';
import { PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useAPICall } from 'hooks/useAPICall';
import { useCountdown } from 'hooks/useCountdown';
// Utils
import { ADMIN_API } from 'services/adapters';
import { ADMIN_ACTIONS } from 'utils/constants';
import { getAnimationClass } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
import { VIPOnlyContainer } from './VIPOnlyContainer';
import { VIPButton } from './VIPButton';
import { useVIP } from 'hooks/useVIP';

function ButtonLabel({ round }: { round?: GameRound }) {
  return !round || round.current === round.total || round.forceLastRound ? (
    <Translate pt="Tela de Game Over" en="Game Over Screen" />
  ) : (
    <Translate pt="Próxima rodada" en="Next Round" />
  );
}

type VIPNextPhaseButtonProps = {
  /**
   * The button content, if not present "Next Round is used instead"
   */
  children?: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Game round information used to determine if it is game over
   */
  round?: GameRound;
  /**
   * Time to auto trigger the button in seconds (default: 45 seconds)
   */
  autoTriggerTime?: number;
};

/**
 * Button only available to the VIP to go to the next phase.
 * It will be auto-triggered after 60 seconds unless value is overridden with a 0
 * It may be paused
 */
export function VIPNextPhaseButton({ round, autoTriggerTime = 45, children }: VIPNextPhaseButtonProps) {
  const isVIP = useVIP();
  const { translate } = useLanguage();
  const { loaders } = useLoading();
  const isLoading = loaders['go-to-next-phase'];

  const onGoToNextPhase = useAPICall({
    apiFunction: ADMIN_API.performAdminAction,
    actionName: 'go-to-next-phase',
    successMessage: translate('Funcionou, próxima fase!', 'It worked, next phase!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar ir para a próxima fase',
      'The application found an error while trying to go to the next phase'
    ),
  });

  const handleClick = () => onGoToNextPhase({ action: ADMIN_ACTIONS.GO_TO_NEXT_PHASE });

  const hasTimer = Boolean(autoTriggerTime);

  const { timeLeft, isRunning, pause, resume } = useCountdown({
    autoStart: autoTriggerTime > 0,
    duration: autoTriggerTime,
    onExpire: handleClick,
    disabled: !isVIP ?? !hasTimer,
  });

  useEffect(() => {
    if (isLoading) {
      pause();
    }
    return () => pause();
  }, [isLoading]); // eslint-disable-line

  return (
    <VIPOnlyContainer
      label="VIP Action"
      className={clsx('vip-only-container--float', getAnimationClass('slideInUp'))}
    >
      <Tooltip title="Pause">
        <VIPButton
          icon={isRunning ? <PauseOutlined /> : <PlayCircleOutlined />}
          onClick={isRunning ? pause : resume}
          disabled={isLoading}
        />
      </Tooltip>
      <VIPButton
        disabled={isLoading}
        onClick={handleClick}
        icon={
          hasTimer && (
            <span
              className={clsx(
                'vip-button-timer',
                !isRunning && getAnimationClass('flash', undefined, 'slow', true)
              )}
            >
              {timeLeft}
            </span>
          )
        }
      >
        {children ?? <ButtonLabel round={round} />}
      </VIPButton>
    </VIPOnlyContainer>
  );
}
