import type { ReactNode } from 'react';
import { FireFilled } from '@ant-design/icons';
import type { GameRound } from 'types/game';
import { useHostActionRequest } from 'hooks/useHostActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { HOST_API_ACTIONS } from 'services/adapters';
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { AdminOnlyContainer } from './AdminOnlyContainer';

function ButtonLabel({ round }: { round?: GameRound }) {
  return !round || round.current === round.total || round.forceLastRound ? (
    <Translate pt="Tela de Game Over" en="Game Over Screen" />
  ) : (
    <Translate pt="Próxima rodada" en="Next Round" />
  );
}

type AdminNextPhaseButtonProps = {
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
   * Time to auto trigger the button in seconds
   */
  autoTriggerTime?: number;
};

/**
 * Button only available to the admin to go to the next phase.
 * It can be auto-triggered by using the autoTriggerTime
 * @param props
 * @returns
 */
export function AdminNextPhaseButton({
  className = '',
  round,
  autoTriggerTime = 0,
  children,
}: AdminNextPhaseButtonProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();

  const onGoToNextPhase = useHostActionRequest({
    actionName: 'force-next-phase',
    successMessage: translate('Funcionou, próxima fase!', 'It worked, next phase!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar ir para a próxima fase',
      'The application found an error while trying to go to the next phase',
    ),
  });

  const handleClick = () => onGoToNextPhase({ action: HOST_API_ACTIONS.GO_TO_NEXT_PHASE });

  return (
    <AdminOnlyContainer className={className}>
      <TimedButton
        icon={<FireFilled />}
        type="primary"
        danger
        disabled={isLoading}
        onClick={handleClick}
        onExpire={handleClick}
        duration={autoTriggerTime}
        hideTimer={!autoTriggerTime}
      >
        {children ?? <ButtonLabel round={round} />}
      </TimedButton>
    </AdminOnlyContainer>
  );
}
