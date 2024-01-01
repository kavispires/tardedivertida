export type PastTweet = {
  id: string;
  text: string;
  likes: number;
  custom?: boolean;
};

export type SubmitTweetPayload = {
  tweetId: string;
  customTweet?: string;
};

export type SubmitReactionPayload = {
  reaction: boolean;
  likesGuess: number;
};
