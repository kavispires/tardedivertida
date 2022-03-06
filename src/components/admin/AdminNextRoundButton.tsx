import clsx from 'clsx';
// Ant Design Resources
import { Button, Space } from 'antd';
import { FireFilled } from '@ant-design/icons';
// State & Hooks
import { useAPICall, useGlobalState, useLanguage, useLoading } from 'hooks';
import { ADMIN_API } from 'adapters';
import { ADMIN_ACTIONS } from 'utils/constants';
// Components
import { Translate } from '..';

function ButtonLabel({ round, lastRound }: { round?: GameRound; lastRound: boolean }) {
  return lastRound || !round || round.current === round.total ? (
    <Translate pt="Tela de Game Over" en="Game Over Screen" />
  ) : (
    <Translate pt="Próxima rodada" en="Next Round" />
  );
}

type AdminNextRoundButtonProps = {
  buttonText?: string;
  className?: string;
  round?: GameRound;
  lastRound?: boolean;
};

export function AdminNextRoundButton({
  buttonText,
  className = '',
  round,
  lastRound = false,
}: AdminNextRoundButtonProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [isAdmin] = useGlobalState('isAdmin');

  const onGoToNextPhase = useAPICall({
    apiFunction: ADMIN_API.performAdminAction,
    actionName: 'force-next-phase',
    successMessage: translate('Funcionou, próxima fase!', 'It worked, next phase!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar ir para a próxima fase',
      'The application found an error while trying to go to the next phase'
    ),
  });

  if (!isAdmin) return <span></span>;

  return (
    <Space className={clsx('admin-only-container', className)}>
      <Button
        icon={<FireFilled />}
        type="primary"
        danger
        onClick={() => onGoToNextPhase({ action: ADMIN_ACTIONS.GO_TO_NEXT_PHASE })}
        disabled={isLoading}
      >
        {buttonText ?? <ButtonLabel round={round} lastRound={lastRound} />}
      </Button>
    </Space>
  );
}
