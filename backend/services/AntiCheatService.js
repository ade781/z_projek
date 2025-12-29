export const enforceCooldown = (lastActionAt, cooldownMs) => {
  if (!lastActionAt) return { allowed: true };
  const last = new Date(lastActionAt).getTime();
  const now = Date.now();
  const diff = now - last;
  if (diff < cooldownMs) {
    return {
      allowed: false,
      remainingMs: cooldownMs - diff,
    };
  }
  return { allowed: true };
};
