import { useState } from 'react';
// Ant Design Resources
import { Button, Input } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { TextCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import { ScoringRules } from './components/RulesBlobs';

type StepTweetSelectionProps = {
  currentTweets: TextCard[];
  currentCustomTweet: TextCard;
  onSubmitTweet: GenericFunction;
  round: GameRound;
  isFixedRounds: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepTweetSelection({
  currentTweets,
  currentCustomTweet,
  onSubmitTweet,
  announcement,
  round,
  isFixedRounds,
}: StepTweetSelectionProps) {
  const { translate } = useLanguage();

  const [customTweet, setCustomTweet] = useState('');

  const onSubmitCustomTweet = () => {
    if (customTweet) {
      onSubmitTweet({ tweetId: currentCustomTweet.id, customTweet });
    }
  };

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Selecione um assunto" en="Select one tweet" />
      </StepTitle>

      <RuleInstruction type="action">
        <ScoringRules round={round} isFixedRounds={isFixedRounds} />
      </RuleInstruction>

      <ul className="p-tweets-card">
        {currentTweets.map((tweet) => (
          <li className="p-tweets-card__item" key={tweet.id}>
            <button
              type="button"
              onClick={() => onSubmitTweet({ tweetId: tweet.id })}
              className="p-tweet p-tweet--button"
            >
              {tweet.text}
            </button>
          </li>
        ))}
        <li className="p-tweets-card__item p-tweets-card__item--or">
          <Translate pt="ou" en="or" />
        </li>
        <li className="p-tweets-card__item p-tweets-card__item--custom">
          <div className="p-tweet">{currentCustomTweet.text}</div>
          <Input
            className="p-custom-tweet__input"
            placeholder={translate('Escreva aqui', 'Write here')}
            onChange={(e) => setCustomTweet(e.target.value)}
            onPressEnter={onSubmitCustomTweet}
          />
          {Boolean(customTweet) && (
            <Button type="primary" onClick={onSubmitCustomTweet} className="p-custom-tweet__button">
              <Translate pt="Enviar sugestão" en="Send suggestion" />
            </Button>
          )}
        </li>
      </ul>
    </Step>
  );
}
