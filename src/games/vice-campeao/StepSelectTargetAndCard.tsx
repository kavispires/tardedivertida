import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
// Ant Design Resources
import { ArrowUpOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Button, Flex } from 'antd';
// Types
import type { GameRound, GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useMock } from '@hooks/useMock';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { PlayersSelect } from '@components/players/PlayersSelect';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { TextHighlight } from '@components/text/TextHighlight';
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
  round: GameRound;
} & Pick<StepProps, 'announcement'>;

export function StepSelectTargetAndCard({
  players,
  user,
  announcement,
  cardsDict,
  race,
  onSubmitCard,
  round,
}: StepSelectTargetAndCardProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(user.id);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const requiresTarget = selectedCardId ? !cardsDict[selectedCardId].autoTarget : false;

  useMock(() => {
    onSubmitCard(mockCardPlay(user, players, cardsDict));
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Prepare-se parar correr"
          en="Prepare to run"
        />
        !{' '}
        <TextHighlight>
          {round.current}/{round.total}
        </TextHighlight>
      </StepTitle>

      <RaceTrack
        runActivity={race[0]}
        players={players}
      />

      <SpaceContainer vertical>
        <RuleInstruction type="action">
          <Translate
            en="Select a card to play!<br />Most cards require a target for you to also select that will suffer the effect of the card.<br /><strong>Remember that the goal is to finish the game in second place!</strong>"
            pt="Escolha uma carta para jogar!<br />A maioria das cartas exige que você selecione um alvo que sofrerá o efeito da carta.<br /><strong>Lembre-se que o objetivo é terminar o jogo em segundo lugar!</strong>"
          />
        </RuleInstruction>
        <Flex gap={12}>
          {user.hand?.map((cardId: string) => {
            const card = cardsDict[cardId];

            return (
              <Flex
                key={cardId}
                vertical
                gap={6}
                align="center"
              >
                <RunCard card={card} />
                <div>
                  <Button
                    onClick={() => setSelectedCardId(cardId)}
                    icon={cardId === selectedCardId ? <CheckCircleFilled /> : <ArrowUpOutlined />}
                    type={cardId === selectedCardId ? 'primary' : 'default'}
                  >
                    <Translate
                      pt="essa"
                      en="this"
                    />
                  </Button>
                </div>
              </Flex>
            );
          })}
        </Flex>

        {requiresTarget && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RuleInstruction type="action">
                <Translate
                  en="Select a player (including yourself) to be the target of the card:"
                  pt="Escolha um jogador (incluindo você mesmo) para ser o alvo da carta:"
                />
              </RuleInstruction>

              <Flex justify="center">
                <PlayersSelect
                  players={players}
                  onChange={setSelectedPlayerId}
                  defaultValue={user.id}
                  value={selectedPlayerId}
                  size="large"
                />
              </Flex>
            </motion.div>
          </AnimatePresence>
        )}

        <SpaceFloat
          enabled={!!selectedCardId && !!selectedPlayerId}
          className="mt-4"
        >
          <SendButton
            size="large"
            onClick={() =>
              onSubmitCard({ cardId: String(selectedCardId), targetId: String(selectedPlayerId) })
            }
            disabled={!selectedCardId || !selectedPlayerId}
          >
            <Translate
              en="Send"
              pt="Enviar"
            />
          </SendButton>
        </SpaceFloat>
      </SpaceContainer>
    </Step>
  );
}
