export const determineView = (
  resolution: EResolution,
  isUserTheSpy: boolean,
  timeRemaining: number,
  locations: ELocation[]
): ResolutionStatus => {
  const guess = locations.find((location: ELocation) => location.id === resolution?.guess) ?? {};

  return {
    isPlayerVictory: resolution.isSpyWin === isUserTheSpy,
    isUserTheSpy,
    wasABadVoting: resolution.isSpyWin && Boolean(timeRemaining > 0),
    wasAnAccusationAttempt: resolution.type === 'SPY_FOUND',
    didSpyGuess: resolution.type === 'SPY_GUESS',
    didTheSpyWin: resolution.isSpyWin,
    phaseIcon: resolution.isSpyWin ? 'nuclear-explosion' : 'handcuffs',
    guess,
    currentLocation: resolution.currentLocation,
  };
};
