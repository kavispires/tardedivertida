import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

const submitAction = httpsCallable(functions, 'linhasCruzadasSubmitAction');

export function useOnSubmitPromptAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-prompt',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Carta enviada com sucesso!', 'Card send successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      'Oops, the application failed to submit the card'
    ),
  });

  return (payload: SubmitPromptPayload) => {
    request({
      action: 'SUBMIT_PROMPT',
      ...payload,
    });
  };
}

export function useOnSubmitDrawingAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-drawing',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate(
      'Acabou o tempo! Aguarde enquanto os outros participantes desenham',
      "Time's up! Wait for the other players to finish their art"
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar o desenho',
      'Oops, the application failed to send your art'
    ),
  });

  return (payload: SubmitDrawingPayload) => {
    request({
      action: 'SUBMIT_DRAWING',
      ...payload,
    });
  };
}

export function useOnSubmitGuessAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-guess',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Resposta enviado com sucesso!', 'Guess submitted successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua resposta',
      'Oops, the application failed to submit your guess'
    ),
  });

  return (payload: SubmitGuessPayload) => {
    request({
      action: 'SUBMIT_GUESS',
      ...payload,
    });
  };
}
