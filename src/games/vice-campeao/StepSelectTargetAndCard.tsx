import { useState } from 'react';
// Ant Design Resources
import { ArrowUpOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Button, Flex } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useMock } from 'hooks/useMock';
// Components
import { SendButton } from 'components/buttons';
import { Translate } from 'components/language';
import { PlayersSelect } from 'components/players/PlayersSelect';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { RunActivity, RunnerCard, SubmitCardPayload } from './utils/types';
import { mockCardPlay } from './utils/mock';
import { RunCard } from './components/RunCard';
import { RaceTrack } from './components/RaceTrack';

type StepSelectTargetAndCardProps = {
  players: GamePlayers;
  user: GamePlayer;
  cardsDict: Dictionary<RunnerCard>;
  race: RunActivity[];
  onSubmitCard: (payload: SubmitCardPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepSelectTargetAndCard({
  players,
  user,
  announcement,
  cardsDict,
  race,
  onSubmitCard,
}: StepSelectTargetAndCardProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(user.id);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  useMock(() => {
    onSubmitCard(mockCardPlay(user, players, cardsDict));
  });

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt={<>Prepare-se parar correr</>} en={<>Prepare to run</>} />!
      </StepTitle>

      <RaceTrack runActivity={race[0]} players={players} />

      <RuleInstruction type="action">
        <Translate
          en="Select a card to play and a player (including yourself) to be the target of the card."
          pt="Escolha uma carta para jogar e um jogador (incluindo você mesmo) para ser o alvo da carta."
        />
        <br />
        <Translate
          en="Some cards don't require a target, so you can just select yourself."
          pt="Algumas cartas não precisam de alvo, então você pode escolher a si mesmo."
        />
        <br />
        <strong>
          <Translate
            en="Lembre-se que o objetivo é terminar o jogo em segundo lugar!"
            pt="Remember that the goal is to finish the game in second place!"
          />
        </strong>
      </RuleInstruction>

      <Instruction contained>
        <Flex align="center" gap={8}>
          <Translate en="Target:" pt="Alvo:" />
          <PlayersSelect
            players={players}
            onChange={setSelectedPlayerId}
            defaultValue={user.id}
            value={selectedPlayerId}
          />
        </Flex>

        <Flex gap={12} className="my-4">
          {user.hand?.map((cardId: string) => {
            const card = cardsDict[cardId];

            return (
              <Flex key={cardId} vertical gap={6}>
                <RunCard card={card} />
                <div>
                  <Button
                    onClick={() => setSelectedCardId(cardId)}
                    icon={cardId === selectedCardId ? <CheckCircleFilled /> : <ArrowUpOutlined />}
                  >
                    essa
                  </Button>
                </div>
              </Flex>
            );
          })}
        </Flex>
        <SendButton
          size="large"
          onClick={() => onSubmitCard({ cardId: String(selectedCardId), targetId: String(selectedPlayerId) })}
          disabled={!selectedCardId || !selectedPlayerId}
        >
          <Translate en="Send" pt="Enviar" />
        </SendButton>
      </Instruction>
    </Step>
  );
}
