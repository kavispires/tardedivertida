import clsx from 'clsx';
import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import type { UseStep } from '@hooks/useStep';
// Utils
import { getMeanDuration } from '@utils/helpers';
// Components
import { TimedButton } from '@components/buttons/TimedButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PopoverRule } from '@components/rules/PopoverRule';
import { Step, type StepProps } from '@components/steps/Step';
import { StepTitle } from '@components/text/StepTitle';
import { TextHighlight } from '@components/text/TextHighlight';
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
        pt="O resultado para {clue} na escala {scale}:"
        en="The answer for {clue} on the scale {scale}:"
        values={{
          clue: <TextHighlight>{currentCategory.clue}</TextHighlight>,
          scale: (
            <strong>
              {currentCategory.left}-{currentCategory.right}
            </strong>
          ),
        }}
      />
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
      hidePlayersBar
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

      <Surface
        contained
        className="my-4"
      >
        <Translate
          pt={`Vocês estão sincronizados? {psychic} acha que ${psychic.guess ? 'sim' : 'não'}`}
          en={`Are you in sync? {psychic} ${psychic.guess ? 'does' : "doesn't"} think so`}
          values={{
            psychic: <PlayerAvatarName player={psychic} />,
          }}
        />
      </Surface>
      <ul className="o-player-guesses">
        {regularPlayers.map((player) => {
          const points = getPoints(player.guess, currentCategory.target ?? 0);
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
              <PointsHighlight
                value={points}
                type={points > 0 ? 'positive' : 'default'}
                omitText
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
