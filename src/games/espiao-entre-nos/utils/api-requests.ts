// Hooks
import { useGameActionRequest } from "hooks/useGameActionRequest";
import { useLanguage } from "hooks/useLanguage";
import type { UseStep } from "hooks/useStep";
// Internal
import { ESPIAO_ENTRE_NOS_ACTIONS } from "./constants";
import type {
  GameProgressPayload,
  GuessLocationPayload,
  MakeAccusationPayload,
  SendLastQuestionerPayload,
  SubmitVotePayload,
} from "./types";

export function useOnGuessLocationAPIRequest(setStep: UseStep["setStep"]) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-guess",
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate(
      "Chute submetido com sucesso",
      "Guess submitted successfully",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar seu chute",
      "Oops, the application found an error while trying to submit your guess",
    ),
  });

  return (payload: GuessLocationPayload) => {
    request({
      action: ESPIAO_ENTRE_NOS_ACTIONS.GUESS_LOCATION,
      ...payload,
    });
  };
}

export function useOnMakeAccusationAPIRequest(setStep: UseStep["setStep"]) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "make-accusation",
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate(
      "Acusação submetida com sucesso",
      "Accusation submitted successfully",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar sua acusação",
      "Oops, the application found an error while trying to submit your acusação",
    ),
  });

  return (payload: MakeAccusationPayload) => {
    request({
      action: ESPIAO_ENTRE_NOS_ACTIONS.MAKE_ACCUSATION,
      ...payload,
    });
  };
}

export function useOnSubmitVoteAPIRequest(setStep: UseStep["setStep"]) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-vote",
    onError: () => setStep(1),
    successMessage: translate(
      "Voto submetido com sucesso",
      "Vote submitted successfully",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar seu voto",
      "Oops, the application found an error while trying to submit your vote",
    ),
  });

  return (payload: SubmitVotePayload) => {
    request({
      action: ESPIAO_ENTRE_NOS_ACTIONS.SUBMIT_VOTE,
      ...payload,
    });
  };
}

export function useOnSendLastQuestionerAPIRequest(setStep: UseStep["setStep"]) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-last-questioner",
    onError: () => setStep(1),
    successMessage: translate(
      "Último perguntador submetido com sucesso",
      "Last questioner submitted successfully",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar o último perguntador",
      "Oops, the application found an error while trying to submit the last questioner",
    ),
  });

  return (payload: SendLastQuestionerPayload) => {
    request({
      action: ESPIAO_ENTRE_NOS_ACTIONS.LAST_QUESTIONER,
      ...payload,
    });
  };
}

// TODO: Fix this
export function useOnProgressGameAPIRequest(setStep: UseStep["setStep"]) {
  // const { translate } = useLanguage();

  // const request = useGameActionRequest({
  //   apiFunction: ADMIN_API.performAdminAction,
  //   actionName: 'progress-game',
  //   onError: () => setStep(1),
  //   successMessage: translate('Jogo progredido com sucesso', 'Game progressed successfully'),
  //   errorMessage: translate(
  //     'Vixi, o aplicativo encontrou um erro ao tentar continuar',
  //     'Oops, the application found an error while trying to continue'
  //   ),
  // });

  // return (payload: GameProgressPayload) => {
  //   request({
  //     action: payload.end ? ADMIN_ACTIONS.FORCE_END_GAME : ADMIN_ACTIONS.GO_TO_NEXT_PHASE,
  //   });
  // };
  return (payload: GameProgressPayload) => {
    console.log(payload);
  };
}
