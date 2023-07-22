import { FILEIRA_DE_FATOS_API } from 'services/adapters';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

export function useOnSubmitOrderingAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: FILEIRA_DE_FATOS_API.submitAction,
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
