// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import { useOnMakeMeReady } from 'hooks/useMakeMeReady';
import type { UseStep } from 'hooks/useStep';
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
    successMessage: translate('Conceito submetido com sucesso', 'Concept submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu conceito',
      'Oops, the application found an error while trying to submit your concept',
    ),
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
    successMessage: translate(
      'Pronto! Aguarde os outros jogadores estarem prontos',
      'Done! Now wait for the other players',
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar confirmar sua porta',
      'Oops, the application failed to confirm your door',
    ),
  });
}

export function useOnSubmitDownvoteConceptsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'downvote-concept',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Conceito votado com sucesso', 'Concept downvoted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar votar no conceito',
      'Oops, the application found an error while trying to downvote the concept',
    ),
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
    successMessage: translate('Nome submetido com sucesso', 'Name submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu nome',
      'Oops, the application found an error while trying to submit your name',
    ),
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
    successMessage: translate('Palpite submetido com sucesso', 'Guess submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu palpite',
      'Oops, the application found an error while trying to submit your guess',
    ),
  });

  return (payload: SubmitGuessesPayload) => {
    request({
      action: IDADE_DA_PREDA_ACTIONS.SUBMIT_GUESSES,
      ...payload,
    });
  };
}
