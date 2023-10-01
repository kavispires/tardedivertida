import { useState } from 'react';
//Design Resources
import { Button, Input } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { ScoringRules } from './components/RulesBlobs';

type StepTweetSelectionProps = {
  currentTweets: Tweet[];
  currentCustomTweet: Tweet;
  onSubmitTweet: GenericFunction;
  round: GameRound;
  isFixedRounds: boolean;
} & AnnouncementProps;

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
      <Title>
        <Translate pt="Selecione um assunto" en="Select one tweet" />
      </Title>

      <Instruction contained>
        <ScoringRules round={round} isFixedRounds={isFixedRounds} />
      </Instruction>

      <ul className="p-tweets-card">
        {currentTweets.map((tweet) => (
          <li className="p-tweets-card__item" key={tweet.id}>
            <button onClick={() => onSubmitTweet({ tweetId: tweet.id })} className="p-tweet p-tweet--button">
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
