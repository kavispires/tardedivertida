import { Location, Resolution, ResolutionStatus } from './types';

export const determineView = (
  resolution: Resolution,
  isUserTheSpy: boolean,
  timeRemaining: number,
  locations: Location[]
): ResolutionStatus => {
  const guess = locations.find((location: Location) => location.id === resolution?.guess) ?? {};

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
