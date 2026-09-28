import { xp } from "../config";

export type Stop = (typeof xp)[number];

/** Default scrubber position: the latest real stop (skips anything marked UPCOMING). */
export function defaultStop(): number {
  for (let i = xp.length - 1; i >= 0; i--) if (xp[i].kind !== "UPCOMING") return i;
  return 0;
}

export const kindClass = (kind: string) => `kind kind--${kind.toLowerCase()}`;
export const valueText = (s: Stop) => `${s.short}, ${s.years}`;
