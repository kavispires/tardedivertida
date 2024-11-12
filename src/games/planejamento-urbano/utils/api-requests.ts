// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitPlacingPayload, SubmitPlanningPayload } from './types';
import { PLANEJAMENTO_URBANO_ACTIONS } from './constants';

export function useOnSubmitPlanningAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-planning',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Planejamento submetido com sucesso', 'Planning submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu planejamento',
      'Oops, the application found an error while trying to submit your planning'
    ),
  });

  return (payload: SubmitPlanningPayload) => {
    request({
      action: PLANEJAMENTO_URBANO_ACTIONS.SUBMIT_PLANNING,
      ...payload,
    });
  };
}

export function useOnSubmitPlacingAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-placing',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Construção submetida com sucesso', 'Construction submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua construção',
      'Oops, the application found an error while trying to submit your construction'
    ),
  });

  return (payload: SubmitPlacingPayload) => {
    request({
      action: PLANEJAMENTO_URBANO_ACTIONS.SUBMIT_PLACEMENTS,
      ...payload,
    });
  };
}

export function useOnUpdatePlacementAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'update-placing',
    successMessage: translate('Construção atualizada com sucesso', 'Construction updated successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua construção',
      'Oops, the application found an error while trying to submit your construction'
    ),
  });

  return (payload: SubmitPlacingPayload) => {
    request({
      action: PLANEJAMENTO_URBANO_ACTIONS.UPDATE_PLACEMENT,
      ...payload,
    });
  };
}
