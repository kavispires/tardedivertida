import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIdle } from "react-use";
// Ant Design Resources
import { App } from "antd";
// Internal
import { useLanguage } from "./useLanguage";

export function useIdleRedirect() {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { translate } = useLanguage();

  // Considers a player idle after 15 minutes of inactivity
  const isIdle = useIdle(9e5);

  useEffect(() => {
    if (isIdle) {
      notification.warning({
        message: translate(
          "Página parada por um longo tempo, redirecionando...",
          "The page has been idle for too long, redirecting...",
        ),
        duration: 5,
        onClose: () => navigate("/"),
        placement: "top",
      });
    }
  }, [isIdle, navigate, translate, notification]);
}
