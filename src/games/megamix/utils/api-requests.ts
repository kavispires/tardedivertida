import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';
import { MEGAMIX_API } from 'services/adapters';

export function useOnSubmitSeedAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: MEGAMIX_API.submitAction,
    actionName: 'submit-seed',
    onSuccess: () => setStep(3),
    successMessage: translate('Dados enviados com sucesso', 'Data submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seus dados',
      'Oops, the application found an error while trying to submit your data'
    ),
  });

  return (payload: SubmitAnswerPayload) => {
    request({
      action: 'SUBMIT_SEEDS',
      ...payload,
    });
  };
}

export function useOnSubmitTrackAnswerAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: MEGAMIX_API.submitAction,
    actionName: 'submit-task',
    onSuccess: () => setStep(3),
    successMessage: translate('Tarefa enviada com sucesso', 'Track submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua tarefa',
      'Oops, the application found an error while trying to submit your task'
    ),
  });

  return (payload: SubmitAnswerPayload) => {
    request({
      action: 'SUBMIT_TRACK_ANSWER',
      ...payload,
    });
  };
}
