import {
  formatDistanceToNowStrict,
  format,
  differenceInDays,
} from "date-fns";

export const relativeTime = (iso: string) => {
  const d = new Date(iso);
  if (differenceInDays(new Date(), d) > 6) {
    return format(d, "MMM d");
  }
  return formatDistanceToNowStrict(d, { addSuffix: true });
};

export const dateStamp = (iso: string) => format(new Date(iso), "MMM d, yyyy");

export const monoDate = (iso: string) =>
  format(new Date(iso), "yyyy.MM.dd · HH:mm");

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
