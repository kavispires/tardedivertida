import { ARTE_RUIM_API } from 'services/adapters';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

export function useOnSubmitVotingAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: ARTE_RUIM_API.submitAction,
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitActionPayload) => {
    request({
      action: 'SUBMIT_ACTION',
      ...payload,
    });
  };
}
