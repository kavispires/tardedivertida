import clsx from 'clsx';
import { type ReactNode, useEffect } from 'react';
// Ant Design Resources
import { PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
// Types
import type { GameRound } from 'types/game';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { useHost } from 'hooks/useHost';
import { useHostActionRequest } from 'hooks/useHostActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Services
import { HOST_API_ACTIONS } from 'services/adapters';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
import { WaitingTime } from 'components/timers';
// Internal
import { HostOnlyContainer } from './HostOnlyContainer';
import { HostButton } from './HostButton';

function ButtonLabel({ round }: { round?: GameRound }) {
  if (!round || round.current === round.total || round.forceLastRound) {
    return <Translate pt="Tela de Game Over" en="Game Over Screen" />;
  }

  return <Translate pt="Próxima rodada" en="Next Round" />;
}

type HostNextPhaseButtonProps = {
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
  /**
   *
   */
  withWaitingTimeBar?: boolean;
};

/**
 * Button only available to the Host to go to the next phase.
 * It will be auto-triggered after 60 seconds unless value is overridden with a 0
 * It may be paused
 */
export function HostNextPhaseButton({
  round,
  autoTriggerTime = 30,
  children,
  withWaitingTimeBar,
}: HostNextPhaseButtonProps) {
  const isHost = useHost();
  const { translate } = useLanguage();
  const { isKeyLoading } = useLoading();
  const isLoading = isKeyLoading('go-to-next-phase');

  const onGoToNextPhase = useHostActionRequest({
    actionName: 'go-to-next-phase',
    successMessage: translate('Funcionou, próxima fase!', 'It worked, next phase!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar ir para a próxima fase',
      'The application found an error while trying to go to the next phase',
    ),
  });

  const handleClick = () => onGoToNextPhase({ action: HOST_API_ACTIONS.GO_TO_NEXT_PHASE });

  const hasTimer = Boolean(autoTriggerTime);

  const { timeLeft, isRunning, pause, resume } = useCountdown({
    autoStart: autoTriggerTime > 0,
    duration: autoTriggerTime,
    onExpire: handleClick,
    disabled: !isHost || !hasTimer,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only watch for isLoading
  useEffect(() => {
    if (isLoading) {
      pause();
    }
    return () => pause();
  }, [isLoading]);

  return (
    <>
      {withWaitingTimeBar && <WaitingTime duration={autoTriggerTime} timeLeft={timeLeft} />}

      <HostOnlyContainer
        label="Host Action"
        className={clsx('host-only-container--float', getAnimationClass('slideInUp'))}
      >
        <Tooltip title="Pause">
          <HostButton
            icon={isRunning ? <PauseOutlined /> : <PlayCircleOutlined />}
            onClick={isRunning ? pause : resume}
            disabled={isLoading}
          />
        </Tooltip>
        <HostButton
          disabled={isLoading}
          onClick={handleClick}
          icon={
            hasTimer && (
              <span
                className={clsx(
                  'host-button-timer',
                  !isRunning &&
                    getAnimationClass('flash', {
                      speed: 'slow',
                      infinite: true,
                    }),
                )}
              >
                {timeLeft}
              </span>
            )
          }
        >
          {children ?? <ButtonLabel round={round} />}
        </HostButton>
      </HostOnlyContainer>
    </>
  );
}
