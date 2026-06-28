export type Status = "seed" | "sprout" | "mature" | "decaying";

const YEAR = 365.25 * 24 * 3600 * 1000;

export function computeStatus(planted: Date, tended?: Date): Status {
  const now = Date.now();
  const last = (tended ?? planted).getTime();
  const age = now - planted.getTime();
  const sinceTouch = now - last;
  if (sinceTouch > YEAR) return "decaying";
  if (age < 0.5 * YEAR) return "seed";
  if (age < 2 * YEAR) return "sprout";
  return "mature";
}

export const STATUS_TIP: Record<Status, string> = {
  seed: "New, under a year old — still rough",
  sprout: "Growing — revised over time",
  mature: "Well-developed and stable",
  decaying: "Untouched in a while — read with care",
};
