// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
// Internal
import type { SubmitGuessesPayload, SubmitWordPayload } from './types';
import { METALINGUAGEM_ACTIONS } from './constants';

export function useOnSubmitNewWordAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-new-word',
    successMessage: translate('Palavra enviada com sucesso', 'Word submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua palavra',
      'Oops, the application found an error while trying to submit your word',
    ),
  });

  return (payload: SubmitWordPayload) => {
    request({
      action: METALINGUAGEM_ACTIONS.SUBMIT_WORD,
      ...payload,
    });
  };
}

export function useOnSubmitGuessAPIRequest(setStep: (step: number) => void) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-guess',
    onSuccess: () => setStep(1),
    onError: () => setStep(0),
    successMessage: translate('Palavra enviada com sucesso', 'Word submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua palavra',
      'Oops, the application found an error while trying to submit your word',
    ),
  });

  return (payload: SubmitGuessesPayload) => {
    request({
      action: METALINGUAGEM_ACTIONS.SUBMIT_GUESS,
      ...payload,
    });
  };
}
