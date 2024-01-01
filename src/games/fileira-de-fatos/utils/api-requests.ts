import type { SubmitScenarioOrderPayload } from './types';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

const submitAction = httpsCallable(functions, 'fileiraDeFatosSubmitAction');

export function useOnSubmitOrderingAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-order',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ordem submetida com sucesso', 'Order submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ordem',
      'Oops, the application found an error while trying to submit your order'
    ),
  });

  return (payload: SubmitScenarioOrderPayload) => {
    request({
      action: 'SUBMIT_SCENARIO_ORDER',
      ...payload,
    });
  };
}
