type Tweet = {
  id: string;
  text: string;
};

type PastTweet = {
  id: string;
  text: string;
  likes: number;
  custom?: boolean;
};

type SubmitTweetPayload = {
  tweetId: string;
  customTweet?: string;
};

type SubmitReactionPayload = {
  reaction: boolean;
  likesGuess: number;
};
