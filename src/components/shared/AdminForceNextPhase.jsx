import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Space } from 'antd';
import { FireFilled } from '@ant-design/icons';
// State & Hooks
import useGlobalState from '../../hooks/useGlobalState';
import { useAPICall, useLoading } from '../../hooks';

function AdminForceNextPhase({ goToNextPhase, className = '' }) {
  const [isLoading] = useLoading();
  const [isAdmin] = useGlobalState('isAdmin');

  const onGoToNextPhase = useAPICall({
    apiFunction: goToNextPhase,
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
        ADMIN: Force Next Phase
      </Button>
    </Space>
  );
}

AdminForceNextPhase.propTypes = {
  goToNextPhase: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default AdminForceNextPhase;
