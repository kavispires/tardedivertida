import React, { useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Design Resources
import { Button, message, notification, Space } from 'antd';
import { FireFilled } from '@ant-design/icons';
// State & Hooks
import useGlobalState from '../../hooks/useGlobalState';
import { useLoading } from '../../hooks';

function AdminForceNextPhase({ goToNextPhase, className = '' }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [isAdmin] = useGlobalState('isAdmin');

  const onGoToNextPhase = useCallback(async () => {
    try {
      setLoader('force-next-phase', true);

      const response = await goToNextPhase({
        gameId,
        gameName,
        playerName: me,
      });
      if (response.data) {
        message.success('Funcionou, próxima fase!');
      }
    } catch (e) {
      notification.error({
        message: 'Vixi, o aplicativo encontrou um erro ao tentar ir para a próxima fase',
        description: JSON.stringify(e),
        placement: 'bottomLeft',
      });
      console.error(e);
    } finally {
      setLoader('force-next-phase', false);
    }
  }, [gameId, gameName, me, setLoader, goToNextPhase]);

  if (!isAdmin) return <span></span>;

  return (
    <Space className={clsx('admin-only-container', className)}>
      <Button icon={<FireFilled />} type="primary" danger onClick={() => onGoToNextPhase()} disabled={false}>
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
