// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import { useOnMakeMeReady } from 'hooks/useMakeMeReady';
import type { UseStep } from 'hooks/useStep';
// Internal
import { COMUNICACAO_ALIENIGENA_ACTIONS } from './constants';
import type {
  SubmitAlienPayload,
  SubmitAlienRequestPayload,
  SubmitAlienResponsePayload,
  SubmitHumanInquiryPayload,
  SubmitOfferingPayload,
  SubmitSeedingPayload,
} from './types';

export function useOnSubmitAlienAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action',
    ),
  });

  return (payload: SubmitAlienPayload) => {
    request({
      action: COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_ALIEN,
      ...payload,
    });
  };
}

export function useOnSubmitSeedingAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-seeds',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Análise submetida com sucesso', 'Analyses submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua análise',
      'Oops, the application found an error while trying to submit your analyses',
    ),
  });

  return (payload: SubmitSeedingPayload) => {
    request({
      action: COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_SEEDS,
      ...payload,
    });
  };
}

export function useOnSubmitHumanInquiryAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action',
    ),
  });

  return (payload: SubmitHumanInquiryPayload) => {
    request({
      action: COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_HUMAN_INQUIRY,
      ...payload,
    });
  };
}

export function useOnSubmitAlienResponseAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-action',
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action',
    ),
  });

  return (payload: SubmitAlienResponsePayload) => {
    request({
      action: COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_ALIEN_RESPONSE,
      ...payload,
    });
  };
}

export function useOnMakeReady() {
  return useOnMakeMeReady({});
}

export function useOnSubmitAlienRequestAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action',
    ),
  });

  return (payload: SubmitAlienRequestPayload) => {
    request({
      action: COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_ALIEN_REQUEST,
      ...payload,
    });
  };
}

export function useOnSubmitOfferingAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action',
    ),
  });

  return (payload: SubmitOfferingPayload) => {
    request({
      action: COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_OFFERING,
      ...payload,
    });
  };
}
