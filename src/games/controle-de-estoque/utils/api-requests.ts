// Hooks
import { useGameActionRequest } from "hooks/useGameActionRequest";
import { useLanguage } from "hooks/useLanguage";
import { useOnMakeMeReady } from "hooks/useMakeMeReady";
import type { UseStep } from "hooks/useStep";
// Internal
import type { PlaceGoodPayload } from "./types";

export function useOnPlaceGoodAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-place-good",
    successMessage: translate(
      "Ação submetida com sucesso",
      "Action submitted successfully",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação",
      "Oops, the application found an error while trying to submit your action",
    ),
  });

  return (payload: PlaceGoodPayload) => {
    request({
      action: "PLACE_GOOD",
      ...payload,
    });
  };
}

export function useOnConfirmGoodPlacementAPIRequest() {
  return useOnMakeMeReady({});
}
