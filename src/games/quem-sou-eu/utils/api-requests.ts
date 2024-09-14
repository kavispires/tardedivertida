// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitCharactersPayload, SubmitGlyphsPayload, SubmitGuessesPayload } from './types';
import { QUEM_SOU_EU_ACTIONS } from './constants';



export function useOnSubmitCharactersAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
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
      action: QUEM_SOU_EU_ACTIONS.SUBMIT_CHARACTERS,
      ...payload,
    });
  };
}

export function useOnSubmitGlyphsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
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
      action: QUEM_SOU_EU_ACTIONS.SUBMIT_GLYPHS,
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
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitGuessesPayload) => {
    request({
      action: QUEM_SOU_EU_ACTIONS.SUBMIT_GUESSES,
      ...payload,
    });
  };
}
