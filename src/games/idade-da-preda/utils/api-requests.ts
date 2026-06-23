// Hooks
import { useGameActionRequest } from '@hooks/useGameActionRequest';
import { useLanguage } from '@hooks/useLanguage';
import { useOnMakeMeReady } from '@hooks/useMakeMeReady';
import type { UseStep } from '@hooks/useStep';
// Internal
import type {
  SubmitConceptsPayload,
  SubmitDownvoteConceptsPayload,
  SubmitGuessesPayload,
  SubmitNamePayload,
} from './types';
import { IDADE_DA_PREDA_ACTIONS } from './constants';

export function useOnSubmitConceptsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-concept',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({
      pt: 'Conceito submetido com sucesso',
      en: 'ConceptData submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar seu conceito',
      en: 'Oops, the application found an error while trying to submit your concept',
    }),
  });

  return (payload: SubmitConceptsPayload) => {
    request({
      action: IDADE_DA_PREDA_ACTIONS.SUBMIT_CONCEPTS,
      ...payload,
    });
  };
}

export function useOnMakeReady(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  return useOnMakeMeReady({
    onSuccess: () => setStep(2),
    successMessage: translate({
      pt: 'Pronto! Aguarde os outros jogadores estarem prontos',
      en: 'Done! Now wait for the other players',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar confirmar sua porta',
      en: 'Oops, the application failed to confirm your door',
    }),
  });
}

export function useOnSubmitDownvoteConceptsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'downvote-concept',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({
      pt: 'Conceito votado com sucesso',
      en: 'ConceptData downvoted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar votar no conceito',
      en: 'Oops, the application found an error while trying to downvote the concept',
    }),
  });

  return (payload: SubmitDownvoteConceptsPayload) => {
    request({
      action: IDADE_DA_PREDA_ACTIONS.DOWNVOTE_CONCEPTS,
      ...payload,
    });
  };
}

export function useOnSubmitNameAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-name',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({ pt: 'Nome submetido com sucesso', en: 'Name submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar seu nome',
      en: 'Oops, the application found an error while trying to submit your name',
    }),
  });

  return (payload: SubmitNamePayload) => {
    request({
      action: IDADE_DA_PREDA_ACTIONS.SUBMIT_NAME,
      ...payload,
    });
  };
}
export function useOnSubmitGuessesAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-guesses',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({ pt: 'Palpite submetido com sucesso', en: 'Guess submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar seu palpite',
      en: 'Oops, the application found an error while trying to submit your guess',
    }),
  });

  return (payload: SubmitGuessesPayload) => {
    request({
      action: IDADE_DA_PREDA_ACTIONS.SUBMIT_GUESSES,
      ...payload,
    });
  };
}
