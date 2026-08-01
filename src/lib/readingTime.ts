const WPM = 200;

/** Rough read time in minutes, from raw Markdown. Code, tags and link URLs are stripped. */
export function readingTime(body?: string): number {
  const text = (body ?? "")
    .replace(/```[\s\S]*?```/g, " ")               // fenced code blocks
    .replace(/`[^`]*`/g, " ")                      // inline code
    .replace(/<[^>]+>/g, " ")                      // raw html tags
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1");    // links / images → their label
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}
