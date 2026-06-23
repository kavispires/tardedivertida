// Hooks
import { useGameActionRequest } from '@hooks/useGameActionRequest';
import { useLanguage } from '@hooks/useLanguage';
import type { UseStep } from '@hooks/useStep';
// Internal
import type {
  SubmitEvaluationFixPayload,
  SubmitEvaluationPayload,
  SubmitItemPlacementPayload,
  SubmitJudgePayload,
} from './types';
import { TEORIA_DE_CONJUNTOS_ACTIONS } from './constants';

export function useOnSubmitJudgeAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-judge',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({ pt: 'Juiz submetido com sucesso', en: 'Judged submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      en: 'Oops, the application found an error while trying to submit your action',
    }),
  });

  return (payload: SubmitJudgePayload) => {
    request({
      action: TEORIA_DE_CONJUNTOS_ACTIONS.SUBMIT_JUDGE,
      ...payload,
    });
  };
}

export function useOnSubmitItemPlacementAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-item-placement',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({ pt: 'Item submetido com sucesso', en: 'Item submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      en: 'Oops, the application found an error while trying to submit your action',
    }),
  });

  return (payload: SubmitItemPlacementPayload) => {
    request({
      action: TEORIA_DE_CONJUNTOS_ACTIONS.SUBMIT_ITEM_PLACEMENT,
      ...payload,
    });
  };
}

export function useOnSubmitEvaluationAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-evaluation',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({
      pt: 'Avaliação submetida com sucesso',
      en: 'Evaluation submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      en: 'Oops, the application found an error while trying to submit your action',
    }),
  });

  return (payload: SubmitEvaluationPayload) => {
    request({
      action: TEORIA_DE_CONJUNTOS_ACTIONS.SUBMIT_EVALUATION,
      ...payload,
    });
  };
}

export function useOnSubmitEvaluationFixAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-evaluation-fix',
    successMessage: translate({
      pt: 'Re-avaliação submetida com sucesso',
      en: 'Reevaluation submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      en: 'Oops, the application found an error while trying to submit your action',
    }),
  });

  return (payload: SubmitEvaluationFixPayload) => {
    request({
      action: TEORIA_DE_CONJUNTOS_ACTIONS.SUBMIT_EVALUATION_FIX,
      ...payload,
    });
  };
}
