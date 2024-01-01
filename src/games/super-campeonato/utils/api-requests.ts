import type {
  SubmitBattleVotesPayload,
  SubmitBetsPayload,
  SubmitChallengePayload,
  SubmitContendersPayload,
} from './type';
import type { UseStep } from 'hooks/useStep';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';
import { ACTIONS } from './constants';

const submitAction = httpsCallable(functions, 'superCampeonatoSubmitAction');

export function useOnSubmitChallengeAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-challenge',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Desafio enviado com sucesso!', 'Challenge send successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar o desafio',
      'Oops, the application failed to submit the challenge'
    ),
  });

  return (payload: SubmitChallengePayload) => {
    request({
      action: ACTIONS.SUBMIT_CHALLENGE,
      ...payload,
    });
  };
}

export function useOnSubmitContenderAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-contender',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Competidor enviado com sucesso!', 'Contender send successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar o competidor',
      'Oops, the application failed to submit the contender'
    ),
  });

  return (payload: SubmitContendersPayload) => {
    request({
      action: ACTIONS.SUBMIT_CONTENDERS,
      ...payload,
    });
  };
}

export function useOnSubmitBetsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-bets',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Apostas enviadas com sucesso!', 'Bets send successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar apostas',
      'Oops, the application failed to submit bets'
    ),
  });

  return (payload: SubmitBetsPayload) => {
    request({
      action: ACTIONS.SUBMIT_BETS,
      ...payload,
    });
  };
}

export function useOnSubmitVotesAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-votes',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Votos enviados com sucesso!', 'Votes send successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar votos',
      'Oops, the application failed to submit votes'
    ),
  });

  return (payload: SubmitBattleVotesPayload) => {
    request({
      action: ACTIONS.SUBMIT_VOTES,
      ...payload,
    });
  };
}
