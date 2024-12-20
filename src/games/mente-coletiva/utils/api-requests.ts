// Hooks
import { useGameActionRequest } from "hooks/useGameActionRequest";
import { useLanguage } from "hooks/useLanguage";
import type { UseStep } from "hooks/useStep";
// Internal
import { MENTE_COLETIVA_ACTIONS } from "./constants";
import type {
  AddAnswerPayload,
  NextAnswersPayload,
  SubmitAnswersPayload,
  SubmitCustomQuestionPayload,
  SubmitQuestionPayload,
} from "./types";

export function useOnSubmitQuestionAPIRequest(setStep: UseStep["setStep"]) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-question",
    onSuccess: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate(
      "Pergunta enviada com sucesso!",
      "Question send successfully!",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar a pergunta",
      "Oops, the application failed to submit the question",
    ),
  });

  return (payload: SubmitQuestionPayload) => {
    request({
      action: MENTE_COLETIVA_ACTIONS.SUBMIT_QUESTION,
      ...payload,
    });
  };
}

export function useOnSubmitCustomQuestionAPIRequest(
  setStep: UseStep["setStep"],
) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-question",
    onSuccess: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate(
      "Pergunta enviada com sucesso!",
      "Question send successfully!",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar a pergunta",
      "Oops, the application failed to submit the question",
    ),
  });

  return (payload: SubmitCustomQuestionPayload) => {
    request({
      action: MENTE_COLETIVA_ACTIONS.SUBMIT_CUSTOM_QUESTION,
      ...payload,
    });
  };
}

export function useOnSubmitAnswersAPIRequest(setStep: UseStep["setStep"]) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-answers",
    onSuccess: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate(
      "Respostas enviadas com sucesso!",
      "Answers send successfully!",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar respostas",
      "Oops, the application failed to submit answers",
    ),
  });

  return (payload: SubmitAnswersPayload) => {
    request({
      action: MENTE_COLETIVA_ACTIONS.SUBMIT_ANSWERS,
      ...payload,
    });
  };
}

export function useOnAddAnswerAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "add-answer",
    successMessage: translate(
      "Resposta adicionada com sucesso!",
      "Answer added successfully!",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar adicionar respostar",
      "Oops, the application failed to add answer",
    ),
  });

  return (payload: AddAnswerPayload) => {
    request({
      action: MENTE_COLETIVA_ACTIONS.ADD_ANSWER,
      ...payload,
    });
  };
}

export function useOnNextAnswersAPIRequest(clearAllowList: GenericFunction) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "next-answers",
    onSuccess: clearAllowList,
    successMessage: translate(
      "Próximas respostas acionadas com sucesso!",
      "Next answers triggered successfully!",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar avançar",
      "Oops, the application failed to advance",
    ),
  });

  return (payload: NextAnswersPayload) => {
    request({
      action: MENTE_COLETIVA_ACTIONS.NEXT_ANSWERS,
      ...payload,
    });
  };
}
