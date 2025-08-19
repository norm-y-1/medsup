/** Tiny deterministic-ish id util for demo purposes. */
export function newId(prefix: string = 'id'): string {
  const rnd = Math.random().toString(36).slice(2, 10)
  return `${prefix}_${rnd}`
}
