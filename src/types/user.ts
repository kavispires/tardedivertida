interface GameUserEntry {
  gameId: GameId;
  startedAt: number;
  endedAt: number;
  playerCount: number;
  placement: number;
  win?: boolean;
  last?: boolean;
  achievements: AchievementKey[];
}

export interface GameUserStatistics {
  gameName: GameName;
  // Total game plays count
  plays: number;
  // Boolean if the game is winnable
  isWinnable: boolean;
  // Total number of wins
  win: number;
  // Total number of times in last place
  last: number;
  // Total number of unique achievements
  achievements: Record<AchievementKey, number>;
  // Total game play duration
  totalPlayDuration: number;
  // The latest game played
  latestPlay: GameUserEntry;
  // The game with the shortest duration
  shortestPlay: GameUserEntry;
  // The game with the longest duration
  longestPlay: GameUserEntry;
  // The first game played with the earliest startedAt
  firstPlay: GameUserEntry;
  // The game rating
  rating: number;
  // Average Player Count
  averagePlayerCount: number;
}

export interface Me {
  id: string;
  isAdmin: boolean;
  names: string[];
  language?: Language;
  // Top 3 avatars
  avatars: AvatarId[];
  gender?: string;
  statistics: {
    // Total game plays count
    plays: number;
    // Total different games
    uniqueGamesPlayed: number;
    // Total games with end goal / are winnable
    winnableGames: number;
    // Total number of wins
    win: number;
    // Total number of times in last place
    last: number;
    // Total number of unique achievements
    achievements: number;
    // Total game play duration
    totalPlayDuration: number;
    // The latest game played
    latestPlay: GameUserEntry;
    // The game with the shortest duration
    shortestPlay: GameUserEntry;
    // The game with the longest duration
    longestPlay: GameUserEntry;
    // The first game played with the earliest startedAt
    firstPlay: GameUserEntry;
    // game with the most entries
    mostPlayedGame: GameName;
    // game with the fewest entries
    leastPlayedGame: GameName;
    // Game with the highest rating
    favoriteGame: GameName;
    // Game with the lowest rating
    leastFavoriteGame: GameName;
    // Game with most wins
    bestAtGame: GameName;
    // Game with most last
    worstAtGame: GameName;
    // Average Player Count
    averagePlayerCount: number;
  };
  games: Record<GameName, GameUserStatistics>;
  blurredImages?: Record<ImageCardId, true>;
  // The latest games statistics
  today: {
    plays: number;
    win: number;
    last: number;
    achievements: number;
    duration: number;
    games: GameUserEntry[];
  };
  daily: {
    total: number;
    longestStreak: number;
    streak: number;
    todaysChallenge?: {
      id: string; // Format YYYY-MM-DD
      number: number;
      victory: boolean;
      hearts: number;
      letters: string[];
    };
  };
}
