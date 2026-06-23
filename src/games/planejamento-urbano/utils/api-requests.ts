// Hooks
import { useGameActionRequest } from '@hooks/useGameActionRequest';
import { useLanguage } from '@hooks/useLanguage';
import type { UseStep } from '@hooks/useStep';
// Internal
import type { SubmitPlacingPayload, SubmitPlanningPayload } from './types';
import { PLANEJAMENTO_URBANO_ACTIONS } from './constants';

export function useOnSubmitPlanningAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-planning',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({
      pt: 'Planejamento submetido com sucesso',
      en: 'Planning submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar seu planejamento',
      en: 'Oops, the application found an error while trying to submit your planning',
    }),
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
    successMessage: translate({
      pt: 'Construção submetida com sucesso',
      en: 'Construction submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua construção',
      en: 'Oops, the application found an error while trying to submit your construction',
    }),
  });

  return (payload: SubmitPlacingPayload) => {
    request({
      action: PLANEJAMENTO_URBANO_ACTIONS.SUBMIT_PLACEMENTS,
      ...payload,
    });
  };
}
