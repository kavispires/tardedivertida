// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type {
  SubmitBossPlayerPayload,
  SubmitSecretWordPayload,
  SubmitPlayerCluesPayload,
  SubmitEvaluationPayload,
  SubmitOutcomePayload,
  SubmitHelpPayload,
} from './types';
import { VENDAVAL_DE_PALPITE_ACTIONS } from './constants';

export function useOnSubmitBossPlayerAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-boss',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate({ pt: 'Chefe enviado com sucesso!', en: 'Boss submitted successfully!' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar o chefe',
      en: 'Oops, the application failed to send the boss player',
    }),
  });

  return (payload: SubmitBossPlayerPayload) => {
    request({
      action: VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_BOSS,
      ...payload,
    });
  };
}

export function useOnSubmitSecretWordAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-secret-word',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate({
      pt: 'Palavra Secreta enviada com sucesso!',
      en: 'Secret word sent successfully!',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar palavra secreta',
      en: 'Oops, the application failed to send your secret word',
    }),
  });

  return (payload: SubmitSecretWordPayload) => {
    request({
      action: VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_SECRET_WORD,
      ...payload,
    });
  };
}

export function useOnSubmitPlayerCluesAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-player-clues',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate({ pt: 'Dica enviada com sucesso!', en: 'Clue sent successfully!' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar dica',
      en: 'Oops, the application failed to send clue',
    }),
  });

  return (payload: SubmitPlayerCluesPayload) => {
    request({
      action: VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_CLUES,
      ...payload,
    });
  };
}

export function useOnSubmitEvaluationAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-evaluation',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate({ pt: 'Avaliação enviada com sucesso!', en: 'Evaluation sent successfully!' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar avaliação',
      en: 'Oops, the application failed to send evaluation',
    }),
  });

  return (payload: SubmitEvaluationPayload) => {
    request({
      action: VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_EVALUATION,
      ...payload,
    });
  };
}

export function useOnSubmitOutcomeAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-outcome',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate({ pt: 'Resultado enviado com sucesso!', en: 'Outcome sent successfully!' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar resultado',
      en: 'Oops, the application failed to send outcome',
    }),
  });

  return (payload: SubmitOutcomePayload) => {
    request({
      action: VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_OUTCOME,
      ...payload,
    });
  };
}

export function useOnSubmitHelpAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-help',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate({ pt: 'Ajuda enviada com sucesso!', en: 'Help sent successfully!' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar ajuda',
      en: 'Oops, the application failed to send help',
    }),
  });

  return (payload: SubmitHelpPayload) => {
    request({
      action: VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_HELP,
      ...payload,
    });
  };
}
