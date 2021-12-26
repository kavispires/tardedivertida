import clsx from 'clsx';
// Design Resources
import { Button, Space } from 'antd';
import { FireFilled } from '@ant-design/icons';
// State & Hooks
import { useAPICall, useGlobalState, useLanguage, useLoading } from '../../hooks';
import { GAME_API } from '../../adapters';
import { translate } from '../shared';

type AdminForceNextPhaseProps = {
  buttonText?: string;
  className?: string;
};

export function AdminForceNextPhase({ buttonText, className = '' }: AdminForceNextPhaseProps) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const [isAdmin] = useGlobalState('isAdmin');

  const onGoToNextPhase = useAPICall({
    apiFunction: GAME_API.goToNextPhase,
    actionName: 'force-next-phase',
    successMessage: translate('Funcionou, próxima fase!', 'It worked, next phase!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar ir para a próxima fase',
      'The application found an error while trying to go to the next phase',
      language
    ),
  });

  if (!isAdmin) return <span></span>;

  return (
    <Space className={clsx('admin-only-container', className)}>
      <Button
        icon={<FireFilled />}
        type="primary"
        danger
        onClick={() => onGoToNextPhase({})}
        disabled={isLoading}
      >
        {buttonText ?? <>Force Next Phase</>}
      </Button>
    </Space>
  );
}
