import React from 'react';
import { useTimer } from 'react-timer-hook';
import { ESPIAO_ENTRE_NOS_API } from '../../../adapters';
import { useAPICall, useGlobalState } from '../../../hooks';

function Timer({ timeRemaining }) {
  const [isAdmin] = useGlobalState('isAdmin');

  const onAdminControl = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.handleAdminAction,
    actionName: 'admin-control',
    successMessage: 'Admin action com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar ação',
  });

  const { minutes, seconds } = useTimer({
    expiryTimestamp: Date.now() + timeRemaining,
    autoStart: true,
    onExpire: isAdmin ? () => onAdminControl({ action: 'final' }) : null,
  });

  return (
    <div className="e-timer">
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
}

export default Timer;
