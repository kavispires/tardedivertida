import { NA_RUA_DO_MEDO_API } from 'adapters';
import { useAPICall, useLanguage } from 'hooks';

export function useOnSubmitDecisionAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: NA_RUA_DO_MEDO_API.submitAction,
    actionName: 'submit-decision',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate('Decisão submetida com sucesso', 'Decision submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua decisão',
      'Oops, the application found an error while trying to submit your decision'
    ),
  });

  return (payload: SubmitDecisionPayload) => {
    request({
      action: 'SUBMIT_DECISION',
      ...payload,
    });
  };
}
