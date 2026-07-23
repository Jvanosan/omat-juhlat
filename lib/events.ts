export const EVENT_TYPES = [
  "Häät",
  "Syntymäpäivä",
  "Valmistujaiset",
  "Yritysjuhla",
  "Ristiäiset",
  "Muu juhla",
] as const;

export type EventType =
  (typeof EVENT_TYPES)[number];

export function isEventType(
  value: string,
): value is EventType {
  return (
    EVENT_TYPES as readonly string[]
  ).includes(value);
}