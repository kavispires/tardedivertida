// Ant Design Resources
import { Button, Space } from "antd";
// Types
import { GameRanking, GameRound } from "types/game";
import { GamePlayer, GamePlayers } from "types/player";
// Hooks
import { useLanguage } from "hooks/useLanguage";
import type { UseStep } from "hooks/useStep";
// Components
import { AvatarName } from "components/avatars";
import { HostNextPhaseButton } from "components/host";
import { Translate } from "components/language";
import { PointsHighlight } from "components/metrics/PointsHighlight";
import { StepRankingWrapper } from "components/ranking";
import { PopoverRule } from "components/rules";
import { RuleInstruction } from "components/text";
// Internal
import type { Outcome } from "./utils/types";
import { ScoringRules } from "./components/RulesBlobs";

type StepRankingProps = {
  players: GamePlayers;
  storyteller: GamePlayer;
  outcome: Outcome;
  ranking: GameRanking;
  round: GameRound;
  goToPreviousStep: UseStep["goToPreviousStep"];
};

const getGainedPointsText = (
  outcome: Outcome,
  translate: (pt: string, en: string, custom?: string | undefined) => string,
) => {
  switch (outcome) {
    case "EVERYBODY_GOT":
      return translate(
        "Pontos porque o Contador de Histórias foi muito obscuro",
        "Points because the Storyteller was too vague",
      );
    case "NOBODY_GOT":
      return translate(
        "Pontos porque o Contador de Histórias foi óbvio",
        "Points because the Storyteller was too obvious",
      );
    default:
      return translate("Pontos por acertar", "Points for getting it right");
  }
};

export function StepRanking({
  players,
  ranking,
  outcome,
  storyteller,
  round,
  goToPreviousStep,
}: StepRankingProps) {
  const { translate } = useLanguage();

  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        getGainedPointsText(outcome, translate),
        "Pontos por votos em sua carta",
      ]}
      subtitle={
        <RuleInstruction type={outcome === "NORMAL" ? "event" : "alert"}>
          {outcome === "EVERYBODY_GOT" && (
            <Translate
              pt={
                <>
                  Todo mundo acertou! <AvatarName player={storyteller} />, da
                  próxima vez, seja menos óbvio(a).
                </>
              }
              en={
                <>
                  Everybody guessed it right!{" "}
                  <AvatarName player={storyteller} />, be less obvious next
                  time.
                </>
              }
            />
          )}
          {outcome === "NOBODY_GOT" && (
            <Translate
              pt={
                <>
                  Ninguém acertou! <AvatarName player={storyteller} />, da
                  próxima vez, seja menos obscuro.
                </>
              }
              en={
                <>
                  Nobody guessed it right! <AvatarName player={storyteller} />,
                  next time be less obscure.
                </>
              }
            />
          )}

          {outcome === "NORMAL" && (
            <Translate
              pt={
                <>
                  Quem acertou ganha{" "}
                  <PointsHighlight type="positive">3</PointsHighlight> pontos!
                  Bom trabalho, <AvatarName player={storyteller} />.
                </>
              }
              en={
                <>
                  Whoever guessed it right got{" "}
                  <PointsHighlight type="positive">3</PointsHighlight> points!
                  Good job, <AvatarName player={storyteller} />
                </>
              }
            />
          )}
        </RuleInstruction>
      }
    >
      <PopoverRule content={<ScoringRules storyteller={storyteller} />} />

      <Space className="space-container" align="center">
        <Button onClick={goToPreviousStep}>
          {translate("Voltar para Solução", "Back to Solution")}
        </Button>
      </Space>

      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
