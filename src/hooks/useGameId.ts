import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
// Ant Design Resources
import { App } from "antd";
// Utils
import { getGameIdFromPathname, isValidGameId } from "utils/helpers";
// Internal
import { useLanguage } from "./useLanguage";

export function useGameId() {
  const { message } = App.useApp();
  const { pathname } = useLocation();
  const { translate } = useLanguage();
  const [gameId, setGameId] = useState(getGameIdFromPathname(pathname));

  const navigate = useNavigate();

  // Verify url game code
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const urlGameId = getGameIdFromPathname(pathname);
    if (isValidGameId(urlGameId)) {
      setGameId(urlGameId);
    } else {
      message.error(
        translate(
          "Vixi, a id do jogo na barra de endereços tá errada",
          "Oops, the game id in the address bar is invalid",
        ),
      );
      setGameId("");
      navigate("/");
    }
  }, [pathname, setGameId]);

  return gameId;
}
