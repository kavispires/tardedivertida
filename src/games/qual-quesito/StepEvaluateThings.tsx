import { useMemo, useState } from 'react';
// Ant Design Resources
import { Flex, Segmented } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
import type { Item } from 'types/tdr';
// Hooks
import { useMock } from 'hooks/useMock';
// Components
import { SendButton } from 'components/buttons';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { SubmitEvaluationsPayload, TableEntry } from './utils/types';
import { mockEvaluations } from './utils/mock';
import { ThingCard } from './components/ThingCard';
import { TripleStateButton } from './components/TripleStateButton';
import { PlayersHandsCounts } from './components/PlayersHandsCounts';
// Hooks

type StepEvaluateThingsProps = {
  players: GamePlayers;
  user: GamePlayer;
  cardsDict: Dictionary<Item>;
  category: string;
  onSubmitEvaluations: (payload: SubmitEvaluationsPayload) => void;
  table: TableEntry[];
  turnOrder: GameOrder;
} & Pick<StepProps, 'announcement'>;

export function StepEvaluateThings({
  announcement,
  user,
  cardsDict,
  category,
  onSubmitEvaluations,
  players,
  turnOrder,
  table,
}: StepEvaluateThingsProps) {
  const [evaluations, setEvaluations] = useState<Record<string, null | boolean>>(
    table
      .filter((entry) => entry.playerId !== user.id)
      .reduce(
        (acc, entry) => {
          acc[entry.cardId] = null;
          return acc;
        },
        {} as Record<string, null | boolean>,
      ),
  );

  const completeEvaluations = useMemo(() => {
    return Object.values(evaluations).every((value) => value !== null);
  }, [evaluations]);

  const handleEvaluateItem = (itemId: string, value: boolean | null) => {
    setEvaluations((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  useMock(() => {
    onSubmitEvaluations({
      evaluations: mockEvaluations(evaluations),
    });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle size="small">
        <Translate pt={<>Avalie as coisas</>} en={<>Evaluate the things</>} />
      </StepTitle>

      <SpaceContainer>
        <Card hideHeader>{category}</Card>
      </SpaceContainer>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Avalie cada uma das coisas abaixo que não são suas, dizendo se elas se encaixam ou não na
              categoria criada. Você pode discutir com os outros jogadores.
              <br />
              Apesar do jogo não mostrar quem colocou cada coisa, você pode defender sua escolha durante a
              discussão!
            </>
          }
          en={
            <>
              Evaluate each of the things below that are not yours, saying whether they fit into the created
              category or not. You can discuss with other players.
              <br />
              Although the game does not show who placed each thing, you can defend your choice during the
              discussion!
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer contained wrap>
        {table.map((entry) => {
          return (
            <Flex key={entry.cardId} vertical gap={6}>
              <ThingCard itemId={entry.cardId} name={cardsDict[entry.cardId].name} width={100} maskImage />
              <Flex justify="center">
                {entry.playerId === user.id ? (
                  <Segmented
                    size="large"
                    disabled
                    options={[{ label: <Translate key="yours" pt="Seu" en="Yours" /> }]}
                  />
                ) : (
                  <TripleStateButton
                    value={evaluations[entry.cardId]}
                    onChange={(value: boolean | null): void => {
                      handleEvaluateItem(entry.cardId, value);
                    }}
                  />
                )}
              </Flex>
            </Flex>
          );
        })}
      </SpaceContainer>

      <SpaceContainer className="my-6">
        <SendButton
          size="large"
          disabled={!completeEvaluations}
          onClick={() => {
            onSubmitEvaluations({ evaluations: evaluations as Record<string, boolean> });
          }}
        >
          <Translate pt="Concluir avaliações" en="Submit evaluations" />
        </SendButton>
      </SpaceContainer>

      <PlayersHandsCounts players={players} turnOrder={turnOrder} />
    </Step>
  );
}
