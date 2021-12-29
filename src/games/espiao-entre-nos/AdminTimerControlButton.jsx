import PropTypes from 'prop-types';
// Hooks
import { useAPICall } from '../../hooks';
// Resources & Utils
import { ESPIAO_ENTRE_NOS_API } from '../../adapters';
// Components
import { AdminOnlyButton } from '../../components/admin/index';

function AdminTimerControlButton({ label = 'Continuar', action = 'resume' }) {
  const onControlStopwatch = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.handleAdminAction,
    actionName: 'timer-control',
    successMessage: 'Admin action com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar ação',
  });

  return <AdminOnlyButton action={() => onControlStopwatch({ action })} label={label} />;
}

AdminTimerControlButton.propTypes = {
  label: PropTypes.string,
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default AdminTimerControlButton;
