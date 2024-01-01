import type {
  SubmitBossPlayerPayload,
  SubmitSecretWordPayload,
  SubmitPlayerCluesPayload,
  SubmitEvaluationPayload,
  SubmitOutcomePayload,
  SubmitHelpPayload,
} from './types';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

const submitAction = httpsCallable(functions, 'vendavalDePalpiteSubmitAction');

export function useOnSubmitBossPlayerAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-boss',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Chefe enviado com sucesso!', 'Boss submitted successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar o chefe',
      'Oops, the application failed to send the boss player'
    ),
  });

  return (payload: SubmitBossPlayerPayload) => {
    request({
      action: 'SUBMIT_BOSS',
      ...payload,
    });
  };
}

export function useOnSubmitSecretWordAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-secret-word',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Palavra Secreta enviada com sucesso!', 'Secret word sent successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar palavra secreta',
      'Oops, the application failed to send your secret word'
    ),
  });

  return (payload: SubmitSecretWordPayload) => {
    request({
      action: 'SUBMIT_SECRET_WORD',
      ...payload,
    });
  };
}

export function useOnSubmitPlayerCluesAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-player-clues',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Dica enviada com sucesso!', 'Clue sent successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar dica',
      'Oops, the application failed to send clue'
    ),
  });

  return (payload: SubmitPlayerCluesPayload) => {
    request({
      action: 'SUBMIT_CLUES',
      ...payload,
    });
  };
}

export function useOnSubmitEvaluationAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-evaluation',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Avaliação enviada com sucesso!', 'Evaluation sent successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar avaliação',
      'Oops, the application failed to send evaluation'
    ),
  });

  return (payload: SubmitEvaluationPayload) => {
    request({
      action: 'SUBMIT_EVALUATION',
      ...payload,
    });
  };
}

export function useOnSubmitOutcomeAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-outcome',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Resultado enviado com sucesso!', 'Outcome sent successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar resultado',
      'Oops, the application failed to send outcome'
    ),
  });

  return (payload: SubmitOutcomePayload) => {
    request({
      action: 'SUBMIT_OUTCOME',
      ...payload,
    });
  };
}

export function useOnSubmitHelpAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-help',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Ajuda enviada com sucesso!', 'Help sent successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar ajuda',
      'Oops, the application failed to send help'
    ),
  });

  return (payload: SubmitHelpPayload) => {
    request({
      action: 'SUBMIT_HELP',
      ...payload,
    });
  };
}
