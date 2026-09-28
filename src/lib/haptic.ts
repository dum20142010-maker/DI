export const triggerHaptic = (pattern: 'light' | 'medium' | 'heavy' | number | number[] = 40) => {
  if (typeof window === 'undefined' || !navigator.vibrate) return;
  try {
    if (pattern === 'light') navigator.vibrate(25);
    else if (pattern === 'medium') navigator.vibrate(50);
    else if (pattern === 'heavy') navigator.vibrate(80);
    else if (Array.isArray(pattern) || typeof pattern === 'number') {
      navigator.vibrate(pattern);
    } else {
      navigator.vibrate(40);
    }
  } catch {
    // Ignore vibration errors if blocked by browser policy
  }
};
