import { FireFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { Translate } from 'components/language';
import { useAPICall, useGlobalState, useLanguage, useLoading } from 'hooks';
import { ReactNode } from 'react';
import { ADMIN_API } from 'services/adapters';
import { ADMIN_ACTIONS } from 'utils/constants';

import { AdminOnlyContainer } from './AdminOnlyContainer';

function ButtonLabel({ round, lastRound }: { round?: GameRound; lastRound: boolean }) {
  return lastRound || !round || round.current === round.total ? (
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
   * Flag indicating if the current round should be considered the final round
   */
  lastRound?: boolean;
};

export function AdminNextPhaseButton({
  className = '',
  round,
  lastRound = false,
  children,
}: AdminNextPhaseButtonProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [isAdmin] = useGlobalState('isAdmin');
  const [isAdminEnabled] = useGlobalState('isAdminEnabled');

  const onGoToNextPhase = useAPICall({
    apiFunction: ADMIN_API.performAdminAction,
    actionName: 'force-next-phase',
    successMessage: translate('Funcionou, próxima fase!', 'It worked, next phase!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar ir para a próxima fase',
      'The application found an error while trying to go to the next phase'
    ),
  });

  if (!isAdmin || !isAdminEnabled) return <span></span>;

  return (
    <AdminOnlyContainer className={className}>
      <Button
        icon={<FireFilled />}
        type="primary"
        danger
        onClick={() => onGoToNextPhase({ action: ADMIN_ACTIONS.GO_TO_NEXT_PHASE })}
        disabled={isLoading}
      >
        {children ?? <ButtonLabel round={round} lastRound={lastRound} />}
      </Button>
    </AdminOnlyContainer>
  );
}
