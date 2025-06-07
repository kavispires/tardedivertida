// Define vibration patterns based on the mode
const patterns: Record<string, number[]> = {
  lose: [200, 100, 200, 100, 200],
  wrong: [100],
};

export const vibrate = (mode: 'lose' | 'wrong'): void => {
  if (navigator.vibrate) {
    // Get the pattern for the specified mode
    const pattern = patterns[mode] || [];

    // If no pattern is defined for the mode, return early
    if (pattern.length === 0) {
      return;
    }

    // Check if vibration API is supported
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }
};
