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
    successMessage: translate('Categoria submetida com sucesso', 'Category submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua categoria',
      'Oops, the application found an error while trying to submit your category',
    ),
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
    successMessage: translate('Vez pulada com sucesso', 'Turn skipped successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar pular sua vez',
      'Oops, the application found an error while trying to skip your turn',
    ),
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
    successMessage: translate('Cartas submetidas com sucesso', 'Cards submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas cartas',
      'Oops, the application found an error while trying to submit your cards',
    ),
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
    successMessage: translate('Avaliações submetidas com sucesso', 'Evaluations submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas avaliações',
      'Oops, the application found an error while trying to submit your evaluations',
    ),
  });

  return (payload: SubmitEvaluationsPayload) => {
    request({
      action: QUAL_QUESITO_ACTIONS.SUBMIT_EVALUATIONS,
      ...payload,
    });
  };
}
