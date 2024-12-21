import { DailyError } from "pages/Daily/components/DailyError";
import { DailyLoading } from "pages/Daily/components/DailyLoading";
// Hooks
import { useCurrentUserContext } from "hooks/useCurrentUserContext";
// Internal
import { DailyPalavreado } from "./components/DailyPalavreado";
import { useDailyChallenge } from "../../hooks/useDailyChallenge";
// Sass
import "./utils/styles.scss";

export function DailyPalavreadoGame() {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const challengeQuery = useDailyChallenge();

  if (challengeQuery.isLoading) {
    return <DailyLoading />;
  }
  const dailyData = challengeQuery?.data?.palavreado;

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyPalavreado data={dailyData} currentUser={currentUser} />;
}
