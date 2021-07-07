import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Space } from 'antd';
import { FireFilled } from '@ant-design/icons';
// State & Hooks
import { useAPICall, useGlobalState, useLoading } from '../../hooks';
import { GAME_API } from '../../adapters';

export function AdminForceNextPhase({ className = '' }) {
  const [isLoading] = useLoading();
  const [isAdmin] = useGlobalState('isAdmin');

  const onGoToNextPhase = useAPICall({
    apiFunction: GAME_API.goToNextPhase,
    actionName: 'force-next-phase',
    successMessage: 'Funcionou, próxima fase!',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar ir para a próxima fase',
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
        Force Next Phase
      </Button>
    </Space>
  );
}

AdminForceNextPhase.propTypes = {
  className: PropTypes.string,
};
