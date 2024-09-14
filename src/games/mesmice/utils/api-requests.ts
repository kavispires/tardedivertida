// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitFeaturePayload, SubmitObjectPayload } from './types';
import { MESMICE_ACTIONS } from './constants';


export function useOnSubmitObjectAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-object',
    onSuccess: () => setStep(3),
    successMessage: translate('Objeto submetido com sucesso', 'Object submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu objeto',
      'Oops, the application found an error while trying to submit your object'
    ),
  });

  return (payload: SubmitObjectPayload) => {
    request({
      action: MESMICE_ACTIONS.SUBMIT_OBJECT,
      ...payload,
    });
  };
}

export function useOnSubmitFeatureAPIRequest(setStep: UseStep['setStep'], errorStep: number) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-feature',
    onSuccess: () => setStep(errorStep + 1),
    onError: () => setStep(errorStep),
    successMessage: translate('Característica submetida com sucesso', 'Feature submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua característica',
      'Oops, the application found an error while trying to submit your feature'
    ),
  });

  return (payload: SubmitFeaturePayload) => {
    request({
      action: MESMICE_ACTIONS.SUBMIT_OBJECT_FEATURE,
      ...payload,
    });
  };
}
