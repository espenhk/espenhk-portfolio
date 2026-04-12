/** Rotating taglines – one is picked at random on each page load */
export const taglines: string[] = [
  "Turning caffeine into pipelines since 2015.",
  "Data Engineer · Manager @ PwC Norway",
  "Making data behave, one DAG at a time.",
  "Pipelines by day, cocktails by night.",
  "Ctrl+S-ing the world, one dataset at a time.",
  "Teaching machines to be slightly less wrong.",
  "SELECT * FROM life WHERE fun = true;",
];

export function getRandomTagline(): string {
  return taglines[Math.floor(Math.random() * taglines.length)];
}
