import clsx from 'clsx';
import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getMeanDuration } from 'utils/helpers';
// Components
import { PlayerAvatar, PlayerAvatarName } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { StarPoints } from 'components/points';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { Instruction, StepTitle } from 'components/text';
// Internal
import type { CurrentCategory } from './utils/types';
import { countDifferentGuesses, getGuessResultClass, getPoints } from './utils/helpers';
import { Dial } from './components/Dial';
import { ScoringRules } from './components/RulesBlobs';

type SentenceProps = {
  currentCategory: CurrentCategory;
};

function Sentence({ currentCategory }: SentenceProps) {
  return (
    <Flex
      wrap="wrap"
      align="center"
      justify="center"
    >
      <Translate
        pt="O resultado para"
        en="The answer for"
      />{' '}
      <span className="o-dial-guess-selection__clue">{currentCategory.clue}</span>{' '}
      <Translate
        pt="na escala"
        en="on the scale"
      />{' '}
      <strong>
        {currentCategory.left}-{currentCategory.right}
      </strong>
      :
    </Flex>
  );
}

type StepRevealProps = {
  currentCategory: CurrentCategory;
  players: GamePlayers;
  psychic: GamePlayer;
  goToNextStep: UseStep['goToNextStep'];
} & Pick<StepProps, 'announcement'>;

export function StepReveal({
  goToNextStep,
  currentCategory,
  players,
  psychic,
  announcement,
}: StepRevealProps) {
  useTemporarilyHidePlayersBar();
  const regularPlayers = useMemo(
    () =>
      orderBy(
        Object.values(players).filter((p) => p.id !== psychic.id),
        ['guess', 'name'],
      ),
    [players, psychic.id],
  );
  const duration = useMemo(
    () => getMeanDuration(countDifferentGuesses(regularPlayers), 4, 10, 20),
    [regularPlayers],
  );

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle
        level={2}
        className="o-step-reveal-title"
        size="small"
      >
        <Sentence currentCategory={currentCategory} />
      </StepTitle>

      <Dial
        card={currentCategory}
        target={currentCategory.target}
        showTarget
        animate
      />

      <Instruction contained>
        <Translate
          pt={
            <>
              Vocês estão sincronizados? <PlayerAvatarName player={psychic} /> acha que{' '}
              {psychic.guess ? 'sim' : 'não'}
            </>
          }
          en={
            <>
              Are you in sync? <PlayerAvatarName player={psychic} /> {psychic.guess ? 'does' : "doesn't"}{' '}
              think so
            </>
          }
        />
      </Instruction>
      <ul className="o-player-guesses">
        {regularPlayers.map((player) => {
          return (
            <li
              className="o-player-guess"
              key={player.id}
            >
              <span
                className={clsx(
                  'o-player-guess__guess',
                  getGuessResultClass(player.guess, currentCategory.target ?? 0),
                )}
              >
                {player.guess < 0 && '«'}
                {Math.abs(player.guess)}
                {player.guess > 0 && '»'}
              </span>
              <PlayerAvatar
                avatarId={player.avatarId}
                className="o-player-guess__avatar"
              />
              <span className="o-player-guess__name">{player.name}</span>
              <StarPoints
                quantity={getPoints(player.guess, currentCategory.target ?? 0)}
                keyPrefix={`${player.id}-points`}
              />
            </li>
          );
        })}
      </ul>

      <PopoverRule content={<ScoringRules />} />

      <SpaceContainer align="center">
        <TimedButton
          duration={duration}
          onExpire={goToNextStep}
          onClick={goToNextStep}
          icon={<TrophyOutlined />}
        >
          <Translate
            pt="Ver Ranking"
            en="See Ranking"
          />
        </TimedButton>
      </SpaceContainer>
    </Step>
  );
}
