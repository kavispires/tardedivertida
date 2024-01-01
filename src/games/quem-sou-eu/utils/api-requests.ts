import type { SubmitCharactersPayload, SubmitGlyphsPayload, SubmitGuessesPayload } from './types';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

const submitAction = httpsCallable(functions, 'quemSouEuSubmitAction');

export function useOnSubmitCharactersAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-characters',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitCharactersPayload) => {
    request({
      action: 'SUBMIT_CHARACTERS',
      ...payload,
    });
  };
}

export function useOnSubmitGlyphsAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-glyphs',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitGlyphsPayload) => {
    request({
      action: 'SUBMIT_GLYPHS',
      ...payload,
    });
  };
}

export function useOnSubmitGuessesAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-guesses',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitGuessesPayload) => {
    request({
      action: 'SUBMIT_GUESSES',
      ...payload,
    });
  };
}
