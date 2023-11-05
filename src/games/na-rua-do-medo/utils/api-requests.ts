import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

const submitAction = httpsCallable(functions, 'naRuaDoMedoSubmitAction');

export function useOnSubmitDecisionAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-decision',
    onSuccess: () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    },
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
