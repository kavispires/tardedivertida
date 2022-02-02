import { ADMIN_API, ESPIAO_ENTRE_NOS_API } from '../../adapters';
import { translate } from '../../components';
import { useAPICall, useLanguage } from '../../hooks';
import { ADMIN_ACTIONS } from '../../utils/constants';

export function useOnGuessLocationAPIRequest(setStep: GenericFunction) {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.submitAction,
    actionName: 'submit-guess',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate('Chute submetido com sucesso', 'Guess submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu chute',
      'Oops, the application found an error while trying to submit your guess',
      language
    ),
  });

  return (payload: GuessLocationPayload) => {
    request({
      action: 'GUESS_LOCATION',
      ...payload,
    });
  };
}

export function useOnMakeAccusationAPIRequest(setStep: GenericFunction) {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.submitAction,
    actionName: 'make-accusation',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate(
      'Acusação submetida com sucesso',
      'Accusation submitted successfully',
      language
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua acusação',
      'Oops, the application found an error while trying to submit your acusação',
      language
    ),
  });

  return (payload: MakeAccusationPayload) => {
    request({
      action: 'MAKE_ACCUSATION',
      ...payload,
    });
  };
}

export function useOnSubmitVoteAPIRequest(setStep: GenericFunction) {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.submitAction,
    actionName: 'submit-vote',
    onError: () => setStep(1),
    successMessage: translate('Voto submetido com sucesso', 'Vote submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu voto',
      'Oops, the application found an error while trying to submit your vote',
      language
    ),
  });

  return (payload: SubmitVotePayload) => {
    request({
      action: 'SUBMIT_VOTE',
      ...payload,
    });
  };
}

export function useOnSendLastQuestionerAPIRequest(setStep: GenericFunction) {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.submitAction,
    actionName: 'submit-last-questioner',
    onError: () => setStep(1),
    successMessage: translate(
      'Último perguntador submetido com sucesso',
      'Last questioner submitted successfully',
      language
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar o último perguntador',
      'Oops, the application found an error while trying to submit the last questioner',
      language
    ),
  });

  return (payload: SendLastQuestionerPayload) => {
    request({
      action: 'LAST_QUESTIONER',
      ...payload,
    });
  };
}

export function useOnProgressGameAPIRequest(setStep: GenericFunction) {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: ADMIN_API.performAdminAction,
    actionName: 'progress-game',
    onError: () => setStep(1),
    successMessage: translate('Jogo progredido com sucesso', 'Game progressed successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar continuar',
      'Oops, the application found an error while trying to continue',
      language
    ),
  });

  return (payload: GameProgressPayload) => {
    request({
      action: payload.end ? ADMIN_ACTIONS.FORCE_END_GAME : ADMIN_ACTIONS.GO_TO_NEXT_PHASE,
    });
  };
}
