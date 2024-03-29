import type { SubmitAnswerPayload } from './types';
import type { UseStep } from 'hooks/useStep';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

const submitAction = httpsCallable(functions, 'megamixSubmitAction');

export function useOnSubmitSeedAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
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

export function useOnSubmitTrackAnswerAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
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
