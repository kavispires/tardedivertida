// Hooks
import { useGameActionRequest } from "hooks/useGameActionRequest";
import { useLanguage } from "hooks/useLanguage";
import type { UseStep } from "hooks/useStep";
// Internal
import type {
  SubmitCategoryPayload,
  SubmitCluePayload,
  SubmitGuessPayload,
} from "./types";
import { ONDA_TELEPATICA_ACTIONS } from "./constants";

export function useOnSubmitCategoryAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-category",
    successMessage: translate(
      "Categoria enviada com sucesso!",
      "Category submitted successfully!",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar a categoria",
      "Oops, the application failed to submit the category",
    ),
  });

  return (payload: SubmitCategoryPayload) => {
    request({
      action: ONDA_TELEPATICA_ACTIONS.SUBMIT_CATEGORY,
      ...payload,
    });
  };
}

export function useOnSubmitClueAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-category",
    successMessage: translate(
      "Categoria enviada com sucesso!",
      "Category submitted successfully!",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar a categoria",
      "Oops, the application failed to submit the category",
    ),
  });

  return (payload: SubmitCluePayload) => {
    request({
      action: ONDA_TELEPATICA_ACTIONS.SUBMIT_CLUE,
      ...payload,
    });
  };
}

export function useOnSubmitGuessAPIRequest(setStep: UseStep["setStep"]) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-guess",
    onSuccess: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate(
      "Resposta enviado com sucesso!",
      "Guess submitted successfully!",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar sua resposta",
      "Oops, the application failed to submit your guess",
    ),
  });

  return (payload: SubmitGuessPayload) => {
    request({
      action: ONDA_TELEPATICA_ACTIONS.SUBMIT_GUESS,
      ...payload,
    });
  };
}
