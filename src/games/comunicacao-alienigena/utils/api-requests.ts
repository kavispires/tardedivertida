import type {
  SubmitAlienPayload,
  SubmitAlienRequestPayload,
  SubmitAlienResponsePayload,
  SubmitHumanInquiryPayload,
  SubmitOfferingPayload,
  SubmitSeedingPayload,
} from './types';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';
import { useOnMakeMeReady } from 'hooks/useMakeMeReady';

const submitAction = httpsCallable(functions, 'comunicacaoAlienigenaSubmitAction');

export function useOnSubmitAlienAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitAlienPayload) => {
    request({
      action: 'SUBMIT_ALIEN',
      ...payload,
    });
  };
}

export function useOnSubmitSeedingAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-seeds',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Análise submetida com sucesso', 'Analyses submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua análise',
      'Oops, the application found an error while trying to submit your analyses'
    ),
  });

  return (payload: SubmitSeedingPayload) => {
    request({
      action: 'SUBMIT_SEEDS',
      ...payload,
    });
  };
}

export function useOnSubmitHumanInquiryAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitHumanInquiryPayload) => {
    request({
      action: 'SUBMIT_HUMAN_INQUIRY',
      ...payload,
    });
  };
}

export function useOnSubmitAlienResponseAPIRequest() {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-action',
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitAlienResponsePayload) => {
    request({
      action: 'SUBMIT_ALIEN_RESPONSE',
      ...payload,
    });
  };
}

export function useOnMakeReady() {
  return useOnMakeMeReady({});
}

export function useOnSubmitAlienRequestAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitAlienRequestPayload) => {
    request({
      action: 'SUBMIT_ALIEN_REQUEST',
      ...payload,
    });
  };
}

export function useOnSubmitOfferingAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitOfferingPayload) => {
    request({
      action: 'SUBMIT_OFFERING',
      ...payload,
    });
  };
}
