// Hooks
import { useGameActionRequest } from "hooks/useGameActionRequest";
import { useLanguage } from "hooks/useLanguage";
import type { UseStep } from "hooks/useStep";
// Internal
import type {
  SubmitDecisionPayload,
  SubmitMessagePayload,
  SubmitTargetPayload,
} from "./types";
import { QUEM_NAO_MATA_ACTIONS } from "./constants";

export function useOnSubmitTargetAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-target",
    successMessage: translate(
      "Alvo selecionado com sucesso",
      "Target set successfully",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar seu alvo",
      "Oops, the application failed to send your target",
    ),
  });

  return (payload: SubmitTargetPayload) => {
    request({
      action: QUEM_NAO_MATA_ACTIONS.SUBMIT_TARGET,
      ...payload,
    });
  };
}

export function useOnSubmitMessageAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-message",
    successMessage: translate(
      "Mensagem enviada com sucesso!",
      "Message sent successfully!",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar a mensagem",
      "Oops, the application failed to send the message",
    ),
  });

  return (payload: SubmitMessagePayload) => {
    request({
      action: QUEM_NAO_MATA_ACTIONS.SUBMIT_MESSAGE,
      ...payload,
    });
  };
}

export function useOnSubmitDecisionAPIRequest(setStep: UseStep["setStep"]) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-decision",
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate(
      "Decisão enviada com sucesso!",
      "Decision sent successfully!",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar a sua decisão",
      "Oops, the application failed to send your decision",
    ),
  });

  return (payload: SubmitDecisionPayload) => {
    request({
      action: QUEM_NAO_MATA_ACTIONS.SUBMIT_DECISION,
      ...payload,
    });
  };
}
