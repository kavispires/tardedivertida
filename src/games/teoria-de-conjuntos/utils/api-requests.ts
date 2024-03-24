import type { SubmitEvaluationPayload, SubmitItemPlacementPayload, SubmitJudgePayload } from './types';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';

const submitAction = httpsCallable(functions, 'teoriaDeConjuntosSubmitAction');

export function useOnSubmitJudgeAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-judge',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Juiz submetido com sucesso', 'Judged submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitJudgePayload) => {
    request({
      action: 'SUBMIT_JUDGE',
      ...payload,
    });
  };
}

export function useOnSubmitItemPlacementAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-item-placement',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Item submetido com sucesso', 'Item submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitItemPlacementPayload) => {
    request({
      action: 'SUBMIT_ITEM_PLACEMENT',
      ...payload,
    });
  };
}

export function useOnSubmitEvaluationAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-evaluation',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Avaliação submetida com sucesso', 'Evaluation submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitEvaluationPayload) => {
    request({
      action: 'SUBMIT_EVALUATION',
      ...payload,
    });
  };
}
