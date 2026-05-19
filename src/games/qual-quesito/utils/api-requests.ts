// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitCardsPayload, SubmitCategoryPayload, SubmitEvaluationsPayload } from './types';
import { QUAL_QUESITO_ACTIONS } from './constants';

export function useOnSubmitCategoryAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-category',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({
      pt: 'Categoria submetida com sucesso',
      en: 'Category submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua categoria',
      en: 'Oops, the application found an error while trying to submit your category',
    }),
  });

  return (payload: SubmitCategoryPayload) => {
    request({
      action: QUAL_QUESITO_ACTIONS.SUBMIT_CATEGORY,
      ...payload,
    });
  };
}

export function useOnSkipTurnAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'skip-turn',
    successMessage: translate({ pt: 'Vez pulada com sucesso', en: 'Turn skipped successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar pular sua vez',
      en: 'Oops, the application found an error while trying to skip your turn',
    }),
  });

  return () => {
    request({
      action: QUAL_QUESITO_ACTIONS.SKIP_TURN,
    });
  };
}

export function useOnSubmitCardsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-cards',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({ pt: 'Cartas submetidas com sucesso', en: 'Cards submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar suas cartas',
      en: 'Oops, the application found an error while trying to submit your cards',
    }),
  });

  return (payload: SubmitCardsPayload) => {
    request({
      action: QUAL_QUESITO_ACTIONS.SUBMIT_CARDS,
      ...payload,
    });
  };
}

export function useOnSubmitEvaluationsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-evaluations',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({
      pt: 'Avaliações submetidas com sucesso',
      en: 'Evaluations submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar suas avaliações',
      en: 'Oops, the application found an error while trying to submit your evaluations',
    }),
  });

  return (payload: SubmitEvaluationsPayload) => {
    request({
      action: QUAL_QUESITO_ACTIONS.SUBMIT_EVALUATIONS,
      ...payload,
    });
  };
}
